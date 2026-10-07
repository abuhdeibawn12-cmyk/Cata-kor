<?php
/**
 * Plugin Name: Catakor Shopify Order Migrator
 * Description: One-time, no-email migration of Shopify order history into WooCommerce with CWILL tracking support.
 * Version: 1.0.15
 * Author: Catakor
 * Requires Plugins: woocommerce
 * Text Domain: catakor-order-migrator
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Catakor_Shopify_Order_Migrator
{
    private const PAGE_SLUG = 'catakor-shopify-order-migrator';

    public static function init(): void
    {
        add_action('before_woocommerce_init', [self::class, 'declare_hpos_compatibility']);
        add_action('admin_menu', [self::class, 'register_admin_page']);
        add_action('admin_post_catakor_import_shopify_orders', [self::class, 'handle_import']);
        add_action('admin_post_catakor_sync_cwill_cloud', [self::class, 'handle_cwill_sync']);
        add_filter('woocommerce_order_number', [self::class, 'use_legacy_order_number'], 10, 2);
        add_filter('the_content', [self::class, 'render_tracking_page'], 999);
    }

    public static function declare_hpos_compatibility(): void
    {
        if (class_exists('Automattic\\WooCommerce\\Utilities\\FeaturesUtil')) {
            Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
                'custom_order_tables',
                __FILE__,
                true
            );
        }
    }

    public static function register_admin_page(): void
    {
        add_submenu_page(
            'woocommerce',
            'Shopify Order Migration',
            'Shopify Migration',
            'manage_woocommerce',
            self::PAGE_SLUG,
            [self::class, 'render_admin_page']
        );
    }

    public static function use_legacy_order_number($order_number, $order)
    {
        if (!$order instanceof WC_Order) {
            return $order_number;
        }

        $legacy = $order->get_meta('_catakor_legacy_order_number', true);
        return $legacy !== '' ? ltrim((string) $legacy, '#') : $order_number;
    }

    public static function render_admin_page(): void
    {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }

        $result = get_transient('catakor_shopify_import_result_' . get_current_user_id());
        if ($result) {
            delete_transient('catakor_shopify_import_result_' . get_current_user_id());
        }
        $sync_result = get_transient('catakor_cwill_sync_result_' . get_current_user_id());
        if ($sync_result) {
            delete_transient('catakor_cwill_sync_result_' . get_current_user_id());
        }
        ?>
        <div class="wrap">
            <h1>Catakor Shopify Order Migration</h1>
            <p>This importer creates historical WooCommerce orders as guests, preserves their Shopify order numbers, and suppresses all WooCommerce customer emails.</p>
            <p>When CWILL is active, the tracking file is imported into CWILL without changing order statuses.</p>

            <?php if (isset($_GET['cwill_sync'])) : ?>
                <div class="notice notice-<?php echo esc_attr($_GET['cwill_sync'] === 'success' ? 'success' : 'error'); ?> is-dismissible">
                    <p>
                        <?php
                        echo esc_html(
                            $_GET['cwill_sync'] === 'success'
                                ? 'CWILL cloud synchronization started. The shipment dashboard can take a few minutes to update.'
                                : 'CWILL cloud synchronization could not be started.'
                        );
                        ?>
                    </p>
                </div>
            <?php endif; ?>

            <?php if (is_array($sync_result)) : ?>
                <div class="notice notice-info is-dismissible">
                    <p><strong>CWILL diagnostic response (customer data omitted):</strong></p>
                    <pre style="white-space:pre-wrap"><?php echo esc_html(wp_json_encode($sync_result, JSON_PRETTY_PRINT)); ?></pre>
                </div>
            <?php endif; ?>

            <?php if (is_array($result)) : ?>
                <div class="notice notice-<?php echo esc_attr(empty($result['errors']) ? 'success' : 'warning'); ?> is-dismissible">
                    <p><strong>Migration result:</strong>
                        <?php
                        echo esc_html(sprintf(
                            '%d created, %d already present, %d failed. CWILL tracking: %d succeeded, %d failed.',
                            (int) ($result['created'] ?? 0),
                            (int) ($result['skipped'] ?? 0),
                            count($result['errors'] ?? []),
                            (int) ($result['tracking_succeeded'] ?? 0),
                            (int) ($result['tracking_failed'] ?? 0)
                        ));
                        ?>
                    </p>
                    <?php if (!empty($result['errors'])) : ?>
                        <ul>
                            <?php foreach ($result['errors'] as $error) : ?>
                                <li><?php echo esc_html($error); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
                <?php wp_nonce_field('catakor_import_shopify_orders'); ?>
                <input type="hidden" name="action" value="catakor_import_shopify_orders">
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="shopify_orders_csv">Shopify orders CSV</label></th>
                        <td><input type="file" id="shopify_orders_csv" name="shopify_orders_csv" accept=".csv,text/csv" required></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="tracking_csv">Tracking map CSV</label></th>
                        <td>
                            <input type="file" id="tracking_csv" name="tracking_csv" accept=".csv,text/csv" required>
                            <p class="description">Columns: shopify_order_number, tracking_number, courier.</p>
                        </td>
                    </tr>
                </table>
                <label>
                    <input type="checkbox" name="confirm_historical_import" value="1" required>
                    Import as historical completed orders and do not email customers.
                </label>
                <?php submit_button('Import historical orders'); ?>
            </form>

            <hr>
            <h2>Synchronize CWILL cloud</h2>
            <p>Send the existing WooCommerce orders and their CWILL tracking records to the authorized CWILL account. This does not change order statuses or send customer emails.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('catakor_sync_cwill_cloud'); ?>
                <input type="hidden" name="action" value="catakor_sync_cwill_cloud">
                <?php submit_button('Sync CWILL cloud', 'secondary'); ?>
            </form>
        </div>
        <?php
    }

    public static function handle_cwill_sync(): void
    {
        if (!current_user_can('manage_woocommerce')) {
            wp_die('You are not allowed to synchronize CWILL.');
        }

        check_admin_referer('catakor_sync_cwill_cloud');

        $api_class = 'ParcelPanel\\Api\\Api';
        $orders_class = 'ParcelPanel\\Api\\Orders';
        $status = 'error';
        $diagnostic = [];
        if (class_exists($api_class) && class_exists($orders_class)) {
            try {
                $order_ids = wc_get_orders([
                    'limit' => -1,
                    'return' => 'ids',
                    'meta_key' => '_catakor_shopify_order_name',
                    'meta_compare' => 'EXISTS',
                ]);
                if ($order_ids) {
                    self::suppress_order_emails(true);
                    $order_ids = array_values(array_map('absint', $order_ids));
                    $tracking_by_order = $orders_class::get_tracking_data_by_order_id($order_ids);
                    $orders = [];
                    $tracking_payload = [];

                    foreach ($order_ids as $order_id) {
                        $order = wc_get_order($order_id);
                        if (!$order) {
                            continue;
                        }
                        $order_data = $orders_class::get_formatted_item_data($order);
                        $order_data['tracking'] = $tracking_by_order[$order_id] ?? [];
                        $orders[] = $order_data;
                        $tracking_payload[$order_id] = ['order' => $order_data];
                    }

                    $order_response = $api_class::add_orders($order_ids, $orders);
                    // Send through ParcelWILL's connected WooCommerce endpoint immediately.
                    // The background scheduler is unreliable on hosts where WP-Cron is delayed,
                    // while this endpoint is included in the free plan's tracking quota.
                    $tracking_response = $api_class::add_tracking($tracking_payload);
                    $tracking_rows_reset = self::reset_imported_tracking_sync($order_ids);
                    $tracking_class = 'ParcelPanel\\Action\\TrackingNumber';
                    if ($tracking_rows_reset > 0 && class_exists($tracking_class)) {
                        $tracking_class::schedule_tracking_sync_action(15);
                    }
                    self::suppress_order_emails(false);
                    $diagnostic = [
                        'orders_requested' => count($orders),
                        'orders_with_tracking' => count(array_filter($tracking_by_order)),
                        'order_api' => self::summarize_api_response($order_response),
                        'tracking_shipments_requested' => count($tracking_payload),
                        'tracking_api' => self::summarize_api_response($tracking_response),
                        'tracking_rows_reset' => $tracking_rows_reset,
                        'tracking_sync' => $tracking_rows_reset > 0 ? 'scheduled_after_15_seconds' : 'not_scheduled',
                    ];
                    $status = is_wp_error($order_response) || is_wp_error($tracking_response) || $tracking_rows_reset < 1
                        ? 'error'
                        : 'success';
                }
            } catch (Throwable $error) {
                self::suppress_order_emails(false);
                $diagnostic = [
                    'exception' => get_class($error),
                    'message' => $error->getMessage(),
                ];
                $status = 'error';
            }
        }

        set_transient('catakor_cwill_sync_result_' . get_current_user_id(), $diagnostic, 10 * MINUTE_IN_SECONDS);

        wp_safe_redirect(add_query_arg([
            'page' => self::PAGE_SLUG,
            'cwill_sync' => $status,
        ], admin_url('admin.php')));
        exit;
    }

    private static function reset_imported_tracking_sync(array $order_ids): int
    {
        global $wpdb;

        $order_ids = array_values(array_unique(array_filter(array_map('absint', $order_ids))));
        if (!$order_ids || !class_exists('ParcelPanel\\Models\\Table')) {
            return 0;
        }

        $tracking_table = \ParcelPanel\Models\Table::$tracking;
        $items_table = \ParcelPanel\Models\Table::$tracking_items;
        $order_placeholders = implode(',', array_fill(0, count($order_ids), '%d'));
        $tracking_ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT tracking.id
             FROM {$tracking_table} AS tracking
             INNER JOIN {$items_table} AS item ON tracking.id = item.tracking_id
             WHERE item.order_id IN ({$order_placeholders}) AND tracking.tracking_number <> ''",
            $order_ids
        ));
        $tracking_ids = array_values(array_unique(array_filter(array_map('absint', (array) $tracking_ids))));
        if (!$tracking_ids) {
            return 0;
        }

        $tracking_placeholders = implode(',', array_fill(0, count($tracking_ids), '%d'));
        $updated = $wpdb->query($wpdb->prepare(
            "UPDATE {$tracking_table} SET sync_times = 0 WHERE id IN ({$tracking_placeholders})",
            $tracking_ids
        ));
        return false === $updated ? 0 : count($tracking_ids);
    }

    private static function build_official_tracking_shipments(array $tracking_by_order): array
    {
        $shipments = [];
        foreach ($tracking_by_order as $order_id => $tracking_items) {
            foreach ((array) $tracking_items as $tracking) {
                $tracking_number = trim((string) ($tracking['tracking_number'] ?? ''));
                if ($tracking_number === '') {
                    continue;
                }

                $courier_code = strtolower(trim((string) ($tracking['courier_code'] ?? '')));
                $courier_code = preg_replace('/[^a-z0-9_-]+/', '', $courier_code);
                if ($courier_code === 'bestfulfill') {
                    $courier_code = 'bestfulfill';
                }

                $shipment = [
                    'order_id' => absint($order_id),
                    'tracking_number' => $tracking_number,
                    'courier_code' => $courier_code,
                    'status_shipped' => 0,
                ];
                $fulfilled_time = absint($tracking['fulfilled_time'] ?? 0);
                if ($fulfilled_time) {
                    $shipment['date_shipped'] = gmdate('Y-m-d H:i:s', $fulfilled_time);
                }
                $shipments[] = $shipment;
            }
        }
        return $shipments;
    }

    private static function send_official_tracking_shipments(array $shipments)
    {
        if (!$shipments) {
            return new WP_Error('catakor_no_shipments', 'No CWILL tracking records were available to send.');
        }

        $api_class = 'ParcelPanel\\Api\\Api';
        if (!class_exists($api_class)) {
            return new WP_Error('catakor_no_cwill_api', 'The CWILL API client is unavailable.');
        }

        $config_response = $api_class::post('/wordpress/userinfo/config', []);
        if (is_wp_error($config_response)) {
            return $config_response;
        }

        $api_key = '';
        if (is_array($config_response)) {
            $api_key = (string) (
                $config_response['data']['store']['apiKey']
                ?? $config_response['store']['apiKey']
                ?? $config_response['data']['apiKey']
                ?? ''
            );
        }
        if ($api_key === '') {
            return new WP_Error('catakor_no_cwill_key', 'The CWILL Tracking API key is unavailable from the authorized integration.');
        }

        $response = wp_remote_post('https://wp-api.parcelwill.net/api/v1/tracking/create', [
            'timeout' => 20,
            'sslverify' => true,
            'headers' => [
                'Content-Type' => 'application/json',
                'PP-Api-Key' => $api_key,
            ],
            'body' => wp_json_encode(['shipments' => array_slice($shipments, 0, 40)]),
        ]);
        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = (int) wp_remote_retrieve_response_code($response);
        $body = json_decode((string) wp_remote_retrieve_body($response), true);
        if (!is_array($body)) {
            return new WP_Error('catakor_invalid_cwill_response', 'CWILL returned an unreadable response.', ['status' => $status_code]);
        }
        if ($status_code < 200 || $status_code >= 300) {
            $message = (string) ($body['msg'] ?? $body['message'] ?? 'CWILL rejected the tracking import.');
            return new WP_Error('catakor_cwill_http_error', $message, ['status' => $status_code]);
        }
        return $body;
    }

    private static function summarize_api_response($response): array
    {
        if (is_wp_error($response)) {
            return [
                'type' => 'error',
                'code' => (string) $response->get_error_code(),
                'message' => (string) $response->get_error_message(),
            ];
        }

        if (!is_array($response)) {
            return [
                'type' => gettype($response),
                'empty' => empty($response),
            ];
        }

        $summary = [
            'type' => 'array',
            'keys' => array_values(array_map('strval', array_keys($response))),
        ];
        foreach (['success', 'status', 'code', 'message', 'msg'] as $key) {
            if (isset($response[$key]) && is_scalar($response[$key])) {
                $summary[$key] = sanitize_text_field((string) $response[$key]);
            }
        }
        foreach (['data', 'errors', 'error'] as $key) {
            if (!array_key_exists($key, $response)) {
                continue;
            }
            $summary[$key . '_type'] = gettype($response[$key]);
            if (is_array($response[$key])) {
                $summary[$key . '_count'] = count($response[$key]);
                $summary[$key . '_keys'] = array_values(array_map('strval', array_keys($response[$key])));
            } elseif (is_scalar($response[$key])) {
                $summary[$key] = sanitize_text_field((string) $response[$key]);
            }
        }
        if (isset($response['data']) && is_array($response['data'])) {
            foreach (['success_count', 'fail_count'] as $count_key) {
                if (isset($response['data'][$count_key])) {
                    $summary[$count_key] = absint($response['data'][$count_key]);
                }
            }
            if (!empty($response['data']['error']) && is_array($response['data']['error'])) {
                $messages = [];
                foreach ($response['data']['error'] as $error) {
                    if (!is_array($error)) {
                        continue;
                    }
                    $messages[] = [
                        'code' => sanitize_text_field((string) ($error['code'] ?? '')),
                        'type' => sanitize_text_field((string) ($error['type'] ?? '')),
                        'message' => sanitize_text_field((string) ($error['message'] ?? '')),
                    ];
                }
                $summary['error_summaries'] = $messages;
            }
        }
        return $summary;
    }

    public static function handle_import(): void
    {
        if (!current_user_can('manage_woocommerce')) {
            wp_die('You are not allowed to import orders.');
        }

        check_admin_referer('catakor_import_shopify_orders');

        if (empty($_POST['confirm_historical_import'])) {
            wp_die('The historical import confirmation is required.');
        }

        if (!class_exists('WooCommerce') || !function_exists('wc_create_order')) {
            wp_die('WooCommerce must be active.');
        }

        $orders_file = self::uploaded_temp_file('shopify_orders_csv');
        $tracking_file = self::uploaded_temp_file('tracking_csv');
        $result = [
            'created' => 0,
            'skipped' => 0,
            'errors' => [],
            'tracking_succeeded' => 0,
            'tracking_failed' => 0,
        ];

        try {
            $rows = self::read_csv($orders_file);
            $tracking_rows = self::read_csv($tracking_file);
            self::assert_columns($rows, ['Name', 'Email', 'Currency', 'Total', 'Lineitem name']);
            self::assert_columns($tracking_rows, ['shopify_order_number', 'tracking_number']);

            $tracking_map = [];
            foreach ($tracking_rows as $tracking_row) {
                $name = trim((string) ($tracking_row['shopify_order_number'] ?? ''));
                if ($name === '') {
                    continue;
                }
                $tracking_map[$name] = [
                    'tracking_number' => trim((string) ($tracking_row['tracking_number'] ?? '')),
                    'courier' => trim((string) ($tracking_row['courier'] ?? '')),
                ];
            }

            $grouped = [];
            foreach ($rows as $row) {
                $name = trim((string) ($row['Name'] ?? ''));
                if ($name !== '') {
                    $grouped[$name][] = $row;
                }
            }

            self::suppress_order_emails(true);
            $tracking_import_rows = [];

            foreach ($grouped as $shopify_name => $order_rows) {
                try {
                    $order_id = self::existing_order_id($shopify_name);
                    if ($order_id) {
                        ++$result['skipped'];
                    } else {
                        $order_id = self::create_order($shopify_name, $order_rows);
                        ++$result['created'];
                    }

                    if (!empty($tracking_map[$shopify_name]['tracking_number'])) {
                        $tracking_import_rows[] = [
                            'order_id' => $order_id,
                            'tracking_number' => $tracking_map[$shopify_name]['tracking_number'],
                            'courier' => $tracking_map[$shopify_name]['courier'],
                            'fulfilled_date' => (string) ($order_rows[0]['Fulfilled at'] ?: $order_rows[0]['Created at']),
                            'mark_order_as_completed' => '0',
                        ];
                    }
                } catch (Throwable $error) {
                    $result['errors'][] = sprintf('%s: %s', $shopify_name, $error->getMessage());
                }
            }

            if ($tracking_import_rows) {
                $tracking_result = self::import_cwill_tracking($tracking_import_rows);
                $result['tracking_succeeded'] = (int) ($tracking_result['succeeded_count'] ?? 0);
                $result['tracking_failed'] = (int) ($tracking_result['failed_count'] ?? 0);
                foreach ((array) ($tracking_result['failed_msg'] ?? []) as $message) {
                    $result['errors'][] = 'CWILL: ' . $message;
                }
            }
        } catch (Throwable $error) {
            $result['errors'][] = $error->getMessage();
        } finally {
            self::suppress_order_emails(false);
        }

        set_transient('catakor_shopify_import_result_' . get_current_user_id(), $result, 10 * MINUTE_IN_SECONDS);
        wp_safe_redirect(admin_url('admin.php?page=' . self::PAGE_SLUG));
        exit;
    }

    private static function uploaded_temp_file(string $field): string
    {
        if (
            empty($_FILES[$field]['tmp_name']) ||
            !isset($_FILES[$field]['error']) ||
            (int) $_FILES[$field]['error'] !== UPLOAD_ERR_OK ||
            !is_uploaded_file($_FILES[$field]['tmp_name'])
        ) {
            throw new RuntimeException('A valid CSV file is required for ' . $field . '.');
        }

        return (string) $_FILES[$field]['tmp_name'];
    }

    private static function read_csv(string $path): array
    {
        $handle = fopen($path, 'rb');
        if (!$handle) {
            throw new RuntimeException('The CSV file could not be opened.');
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            throw new RuntimeException('The CSV file is empty.');
        }
        $headers = array_map(static function ($header) {
            return trim(preg_replace('/^\xEF\xBB\xBF/', '', (string) $header));
        }, $headers);

        $rows = [];
        while (($values = fgetcsv($handle)) !== false) {
            if (!array_filter($values, static fn($value) => trim((string) $value) !== '')) {
                continue;
            }
            $values = array_pad($values, count($headers), '');
            $rows[] = array_combine($headers, array_slice($values, 0, count($headers)));
        }
        fclose($handle);
        return $rows;
    }

    private static function assert_columns(array $rows, array $required): void
    {
        if (!$rows) {
            throw new RuntimeException('The CSV file contains no data rows.');
        }
        foreach ($required as $column) {
            if (!array_key_exists($column, $rows[0])) {
                throw new RuntimeException('Required CSV column is missing: ' . $column);
            }
        }
    }

    private static function existing_order_id(string $shopify_name): int
    {
        $ids = wc_get_orders([
            'limit' => 1,
            'return' => 'ids',
            'meta_key' => '_catakor_shopify_order_name',
            'meta_value' => $shopify_name,
        ]);
        return $ids ? (int) $ids[0] : 0;
    }

    private static function create_order(string $shopify_name, array $rows): int
    {
        $first = $rows[0];
        $order = wc_create_order([
            'status' => 'completed',
            'customer_id' => 0,
            'created_via' => 'catakor_shopify_migration',
        ]);
        if (is_wp_error($order)) {
            throw new RuntimeException($order->get_error_message());
        }

        $order->set_currency(sanitize_text_field((string) ($first['Currency'] ?: 'USD')));
        $order->set_prices_include_tax(false);
        $order->set_billing_first_name(self::first_name((string) $first['Billing Name']));
        $order->set_billing_last_name(self::last_name((string) $first['Billing Name']));
        $order->set_billing_company(sanitize_text_field((string) $first['Billing Company']));
        $order->set_billing_address_1(sanitize_text_field((string) $first['Billing Address1']));
        $order->set_billing_address_2(sanitize_text_field((string) $first['Billing Address2']));
        $order->set_billing_city(sanitize_text_field((string) $first['Billing City']));
        $order->set_billing_state(sanitize_text_field((string) $first['Billing Province']));
        $order->set_billing_postcode(sanitize_text_field((string) $first['Billing Zip']));
        $order->set_billing_country(self::country_code((string) $first['Billing Country']));
        $order->set_billing_email(sanitize_email((string) $first['Email']));
        $order->set_billing_phone(sanitize_text_field((string) ($first['Billing Phone'] ?: $first['Phone'])));

        $shipping_name = (string) ($first['Shipping Name'] ?: $first['Billing Name']);
        $order->set_shipping_first_name(self::first_name($shipping_name));
        $order->set_shipping_last_name(self::last_name($shipping_name));
        $order->set_shipping_company(sanitize_text_field((string) $first['Shipping Company']));
        $order->set_shipping_address_1(sanitize_text_field((string) $first['Shipping Address1']));
        $order->set_shipping_address_2(sanitize_text_field((string) $first['Shipping Address2']));
        $order->set_shipping_city(sanitize_text_field((string) $first['Shipping City']));
        $order->set_shipping_state(sanitize_text_field((string) $first['Shipping Province']));
        $order->set_shipping_postcode(sanitize_text_field((string) $first['Shipping Zip']));
        $order->set_shipping_country(self::country_code((string) $first['Shipping Country']));
        $order->set_shipping_phone(sanitize_text_field((string) $first['Shipping Phone']));

        $subtotal = 0.0;
        $line_total = 0.0;
        foreach ($rows as $row) {
            $quantity = max(1, (int) $row['Lineitem quantity']);
            $price = self::money($row['Lineitem price']);
            $discount = self::money($row['Lineitem discount']);
            $item_subtotal = $price * $quantity;
            $item_total = max(0, $item_subtotal - $discount);
            $subtotal += $item_subtotal;
            $line_total += $item_total;

            $item = new WC_Order_Item_Product();
            $item->set_name(sanitize_text_field((string) $row['Lineitem name']));
            $item->set_quantity($quantity);
            $item->set_subtotal($item_subtotal);
            $item->set_total($item_total);
            $item->set_taxes(['total' => [], 'subtotal' => []]);

            $sku = trim((string) $row['Lineitem sku']);
            $product_id = $sku !== '' ? (int) wc_get_product_id_by_sku($sku) : 0;
            if ($product_id) {
                $product = wc_get_product($product_id);
                if ($product) {
                    $item->set_product_id($product->is_type('variation') ? $product->get_parent_id() : $product_id);
                    $item->set_variation_id($product->is_type('variation') ? $product_id : 0);
                }
            }
            $order->add_item($item);
        }

        $shipping_total = self::money($first['Shipping']);
        if ($shipping_total > 0 || !empty($first['Shipping Method'])) {
            $shipping = new WC_Order_Item_Shipping();
            $shipping->set_method_title(sanitize_text_field((string) ($first['Shipping Method'] ?: 'Shipping')));
            $shipping->set_method_id('shopify_legacy');
            $shipping->set_total($shipping_total);
            $shipping->set_taxes(['total' => []]);
            $order->add_item($shipping);
        }

        $order->set_discount_total(max(0, $subtotal - $line_total));
        $order->set_shipping_total($shipping_total);
        $order->set_cart_tax(0);
        $order->set_shipping_tax(0);
        $order->set_total(self::money($first['Total']));
        $order->set_payment_method('shopify_legacy');
        $order->set_payment_method_title(sanitize_text_field((string) ($first['Payment Method'] ?: 'Shopify')));
        $order->set_transaction_id(sanitize_text_field((string) ($first['Payment Reference'] ?: $first['Payment ID'])));
        $order->set_customer_note(sanitize_textarea_field((string) $first['Notes']));

        if (!empty($first['Created at'])) {
            $order->set_date_created(wc_string_to_datetime((string) $first['Created at']));
        }
        if (!empty($first['Paid at'])) {
            $order->set_date_paid(wc_string_to_datetime((string) $first['Paid at']));
        }
        if (!empty($first['Fulfilled at'])) {
            $order->set_date_completed(wc_string_to_datetime((string) $first['Fulfilled at']));
        }

        $order->update_meta_data('_catakor_shopify_order_name', $shopify_name);
        $order->update_meta_data('_catakor_legacy_order_number', $shopify_name);
        $order->update_meta_data('_catakor_shopify_order_id', sanitize_text_field((string) $first['Id']));
        $order->update_meta_data('_catakor_shopify_source', sanitize_text_field((string) $first['Source']));
        $order->update_meta_data('_catakor_imported_at', gmdate('c'));
        $order->save();
        $order->add_order_note('Imported from Shopify as historical order. No customer notification was sent.', 0, false);

        return (int) $order->get_id();
    }

    private static function import_cwill_tracking(array $rows): array
    {
        $class = 'ParcelPanel\\Libs\\Import\\TrackingNumberCSVImporter';
        if (!class_exists($class)) {
            return [
                'succeeded_count' => 0,
                'failed_count' => count($rows),
                'failed_msg' => ['CWILL is not active or its importer is unavailable.'],
            ];
        }

        $temp_dir = get_temp_dir();
        $path = trailingslashit($temp_dir) . wp_unique_filename($temp_dir, 'catakor-cwill-import.csv');
        $handle = fopen($path, 'wb');
        fputcsv($handle, ['order_id', 'tracking_number', 'courier', 'fulfilled_date', 'mark_order_as_completed']);
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);

        try {
            $importer = new $class($path, [
                'lines' => 500,
                'mapping' => [
                    'order_id' => 'order_number',
                    'tracking_number' => 'tracking_number',
                    'courier' => 'courier',
                    'fulfilled_date' => 'fulfilled_date',
                    'mark_order_as_completed' => 'mark_order_as_completed',
                ],
                'parse' => true,
                'prevent_timeouts' => false,
            ]);
            return (array) $importer->import();
        } finally {
            if (is_file($path)) {
                unlink($path);
            }
        }
    }

    public static function render_tracking_page(string $content): string
    {
        if (is_admin() || !is_singular('page')) {
            return $content;
        }

        $page = get_queried_object();
        if (!$page instanceof WP_Post || $page->post_name !== 'parcel-panel') {
            return $content;
        }

        // ParcelPanel's shortcode runs before this late content override and queues
        // its React application. The custom Catakor tracker does not render the
        // expected #pp-root mount point, so leaving that bundle queued produces a
        // React createRoot error on an otherwise functional tracking page.
        wp_dequeue_script('pp-user-track-page-new');
        wp_deregister_script('pp-user-track-page-new');
        wp_dequeue_style('pp-user-track-page-new');
        wp_deregister_style('pp-user-track-page-new');

        $tracking_number = isset($_GET['nums'])
            ? strtoupper(preg_replace('/[^A-Za-z0-9_-]/', '', (string) wp_unslash($_GET['nums'])))
            : '';
        $lookup_mode = $tracking_number !== '' || (isset($_GET['lookup']) && sanitize_key((string) wp_unslash($_GET['lookup'])) === 'tracking')
            ? 'tracking'
            : 'order';
        $order_number_input = '';
        $email_input = '';
        $submitted = $tracking_number !== '';
        $tracking = $tracking_number !== '' ? self::find_local_tracking($tracking_number) : null;

        if (
            isset($_SERVER['REQUEST_METHOD'])
            && strtoupper((string) $_SERVER['REQUEST_METHOD']) === 'POST'
            && isset($_POST['catakor_lookup_mode'])
            && sanitize_key((string) wp_unslash($_POST['catakor_lookup_mode'])) === 'order'
        ) {
            $lookup_mode = 'order';
            $submitted = true;
            $order_number_input = isset($_POST['order_number'])
                ? preg_replace('/[^A-Za-z0-9#_-]/', '', (string) wp_unslash($_POST['order_number']))
                : '';
            $email_input = isset($_POST['order_email'])
                ? sanitize_email((string) wp_unslash($_POST['order_email']))
                : '';
            $tracking = ($order_number_input !== '' && $email_input !== '')
                ? self::find_local_tracking_by_order_email($order_number_input, $email_input)
                : null;
            $tracking_number = $tracking ? (string) $tracking->tracking_number : '';
        }

        $carrier = $tracking ? self::fetch_bestfulfill_tracking($tracking_number) : [];

        ob_start();
        ?>
        <section class="catakor-track" aria-labelledby="catakor-track-title">
            <div class="catakor-track__hero">
                <span class="catakor-track__eyebrow">ORDER TRACKING</span>
                <h1 id="catakor-track-title">TRACK YOUR ORDER.</h1>
                <p>Use your order details or tracking number to see the latest carrier update.</p>
            </div>

            <nav class="catakor-track__tabs" aria-label="Tracking lookup method">
                <a class="<?php echo $lookup_mode === 'order' ? 'is-active' : ''; ?>" href="<?php echo esc_url(get_permalink($page)); ?>" <?php echo $lookup_mode === 'order' ? 'aria-current="page"' : ''; ?>>Order number &amp; email</a>
                <a class="<?php echo $lookup_mode === 'tracking' ? 'is-active' : ''; ?>" href="<?php echo esc_url(add_query_arg('lookup', 'tracking', get_permalink($page))); ?>" <?php echo $lookup_mode === 'tracking' ? 'aria-current="page"' : ''; ?>>Tracking number</a>
            </nav>

            <?php if ($lookup_mode === 'order') : ?>
                <form class="catakor-track__form catakor-track__form--order" method="post" action="<?php echo esc_url(get_permalink($page)); ?>">
                    <input type="hidden" name="catakor_lookup_mode" value="order">
                    <div class="catakor-track__fields">
                        <label for="catakor-order-number">Order number
                            <input id="catakor-order-number" name="order_number" type="text" value="<?php echo esc_attr($order_number_input); ?>" placeholder="e.g. 1022" autocomplete="off" required>
                        </label>
                        <label for="catakor-order-email">Email address
                            <input id="catakor-order-email" name="order_email" type="email" value="<?php echo esc_attr($email_input); ?>" placeholder="Email used at checkout" autocomplete="email" required>
                        </label>
                    </div>
                    <button type="submit">Track order <span aria-hidden="true">→</span></button>
                </form>
            <?php else : ?>
                <form class="catakor-track__form" method="get" action="<?php echo esc_url(get_permalink($page)); ?>">
                    <input type="hidden" name="lookup" value="tracking">
                    <label for="catakor-tracking-number">Tracking number</label>
                    <div class="catakor-track__form-row">
                        <input id="catakor-tracking-number" name="nums" type="text" value="<?php echo esc_attr($tracking_number); ?>" placeholder="e.g. BEST123456789" autocomplete="off" required>
                        <button type="submit">Track parcel <span aria-hidden="true">→</span></button>
                    </div>
                </form>
            <?php endif; ?>

            <?php if ($submitted && !$tracking) : ?>
                <div class="catakor-track__notice catakor-track__notice--error" role="status">
                    <strong>We could not find a matching shipment.</strong>
                    <span>Check your details exactly as shown in the order confirmation, or contact support@catakor.store.</span>
                </div>
            <?php elseif ($tracking) :
                $order = wc_get_order((int) $tracking->order_id);
                $order_number = $order ? (string) $order->get_order_number() : '';
                $status = (string) ($carrier['status'] ?? 'Tracking registered');
                $last_date = (string) ($carrier['date'] ?? '');
                $events = (array) ($carrier['events'] ?? []);
                ?>
                <div class="catakor-track__result" role="status">
                    <div class="catakor-track__result-head">
                        <div>
                            <span class="catakor-track__eyebrow">LATEST UPDATE</span>
                            <h2><?php echo esc_html($status); ?></h2>
                            <?php if ($last_date !== '') : ?>
                                <p>Updated <?php echo esc_html($last_date); ?></p>
                            <?php else : ?>
                                <p>Your tracking number is registered with the fulfilment carrier.</p>
                            <?php endif; ?>
                        </div>
                        <span class="catakor-track__status-dot" aria-hidden="true"></span>
                    </div>

                    <dl class="catakor-track__meta">
                        <?php if ($order_number !== '') : ?>
                            <div><dt>Order</dt><dd>#<?php echo esc_html(ltrim($order_number, '#')); ?></dd></div>
                        <?php endif; ?>
                        <div><dt>Tracking number</dt><dd><?php echo esc_html($tracking_number); ?></dd></div>
                        <div><dt>Carrier</dt><dd><?php echo esc_html(ucfirst((string) ($tracking->courier_code ?: 'Bestfulfill'))); ?></dd></div>
                    </dl>

                    <?php if ($events) : ?>
                        <div class="catakor-track__timeline">
                            <h3>Tracking history</h3>
                            <?php foreach ($events as $event) : ?>
                                <article>
                                    <span aria-hidden="true"></span>
                                    <div>
                                        <strong><?php echo esc_html((string) ($event['message'] ?? 'Carrier update')); ?></strong>
                                        <p><?php echo esc_html(trim((string) ($event['date'] ?? '') . ' ' . (string) ($event['location'] ?? ''))); ?></p>
                                    </div>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                </div>
            <?php endif; ?>
        </section>
        <style>
            .catakor-track{--ck-green:#173f17;--ck-lime:#ddff62;--ck-ink:#102d13;max-width:980px;margin:48px auto 96px;padding:0 24px;color:var(--ck-ink)}
            .catakor-track__hero{max-width:760px;margin-bottom:34px}.catakor-track__eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.18em;color:#4c6849;margin-bottom:12px}
            .catakor-track h1{font-size:clamp(44px,8vw,86px);line-height:.88;letter-spacing:-.06em;margin:0 0 22px;color:var(--ck-green)}.catakor-track__hero p{font-size:18px;line-height:1.55;color:#5d685c;max-width:650px}
            .catakor-track__tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;max-width:570px;margin:0 0 16px;padding:5px;border-radius:999px;background:#edf2e9}.catakor-track__tabs a{display:flex;align-items:center;justify-content:center;min-height:46px;padding:8px 16px;border-radius:999px;color:#536050!important;font-size:13px;font-weight:800;text-align:center;text-decoration:none}.catakor-track__tabs a.is-active{background:var(--ck-green);color:#fff!important;box-shadow:0 8px 22px rgba(23,63,23,.18)}
            .catakor-track__form,.catakor-track__result,.catakor-track__notice{background:#fff;border:1px solid #dfe6dc;border-radius:24px;box-shadow:0 18px 50px rgba(22,63,23,.08)}
            .catakor-track__form{padding:26px;margin-bottom:24px}.catakor-track__form label{display:block;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin:0 0 10px}
            .catakor-track__form-row,.catakor-track__fields{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px}.catakor-track__fields{grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:12px}.catakor-track__fields label{margin:0}.catakor-track__form input{display:block;width:100%;min-height:58px;margin-top:10px;border:1px solid #bfcbbd;border-radius:14px;padding:0 18px;font-size:17px;font-weight:500;letter-spacing:0;text-transform:none;color:var(--ck-ink);background:#fbfdf8}
            .catakor-track__form input:focus{outline:3px solid rgba(221,255,98,.7);border-color:var(--ck-green)}.catakor-track__form button{display:inline-flex;align-items:center;justify-content:center;gap:28px;min-height:58px;border:0;border-radius:999px;background:var(--ck-green);color:#fff!important;padding:0 28px;font-size:15px;font-weight:800;text-decoration:none;cursor:pointer}
            .catakor-track__form--order button{width:100%}
            .catakor-track__notice{padding:24px 28px;display:grid;gap:5px}.catakor-track__notice--error{border-color:#e7c8c3;background:#fff9f7}.catakor-track__notice span{color:#6d756c}
            .catakor-track__result{padding:34px}.catakor-track__result-head{display:flex;align-items:flex-start;justify-content:space-between;gap:22px;padding-bottom:28px;border-bottom:1px solid #e5eae3}.catakor-track__result h2{font-size:clamp(28px,5vw,46px);line-height:1.05;letter-spacing:-.04em;margin:0 0 8px;color:var(--ck-green)}.catakor-track__result-head p{margin:0;color:#657164}
            .catakor-track__status-dot{width:18px;height:18px;border-radius:50%;background:var(--ck-lime);box-shadow:0 0 0 7px rgba(221,255,98,.28);margin:12px 8px}
            .catakor-track__meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:26px 0}.catakor-track__meta div{padding:18px;border-radius:16px;background:#f3f6ef}.catakor-track__meta dt{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#738071;margin-bottom:7px}.catakor-track__meta dd{margin:0;font-size:15px;font-weight:800;overflow-wrap:anywhere}
            .catakor-track__timeline{margin:34px 0}.catakor-track__timeline h3{font-size:20px;margin:0 0 18px}.catakor-track__timeline article{display:grid;grid-template-columns:18px 1fr;gap:15px;position:relative;padding-bottom:24px}.catakor-track__timeline article>span{width:12px;height:12px;border-radius:50%;background:var(--ck-green);margin-top:4px;box-shadow:0 0 0 5px #ecf3e9}.catakor-track__timeline article:not(:last-child):before{content:"";position:absolute;left:5px;top:18px;bottom:2px;width:2px;background:#dce6d8}.catakor-track__timeline strong{display:block;font-size:16px}.catakor-track__timeline p{margin:5px 0 0;color:#6a7568;font-size:14px}
            @media(max-width:680px){.catakor-track{margin:32px auto 68px;padding:0 16px}.catakor-track__tabs{max-width:none}.catakor-track__tabs a{padding:8px 10px;font-size:12px}.catakor-track__form-row,.catakor-track__fields{grid-template-columns:1fr}.catakor-track__form button{width:100%}.catakor-track__result{padding:24px 20px}.catakor-track__meta{grid-template-columns:1fr}.catakor-track h1{font-size:52px}}
        </style>
        <?php
        return (string) ob_get_clean();
    }

    private static function find_local_tracking(string $tracking_number)
    {
        global $wpdb;
        if (!class_exists('ParcelPanel\\Models\\Table')) {
            return null;
        }

        $tracking_table = \ParcelPanel\Models\Table::$tracking;
        $items_table = \ParcelPanel\Models\Table::$tracking_items;
        return $wpdb->get_row($wpdb->prepare(
            "SELECT tracking.tracking_number, tracking.courier_code, tracking.fulfilled_at, item.order_id
             FROM {$tracking_table} AS tracking
             INNER JOIN {$items_table} AS item ON item.tracking_id = tracking.id
             WHERE tracking.tracking_number = %s
             ORDER BY item.id ASC
             LIMIT 1",
            $tracking_number
        ));
    }

    private static function find_local_tracking_by_order_email(string $order_number, string $email)
    {
        $order_number = ltrim(trim($order_number), '#');
        $email = strtolower(trim($email));
        if ($order_number === '' || $email === '') {
            return null;
        }

        $orders = wc_get_orders([
            'limit' => 25,
            'return' => 'objects',
            'type' => 'shop_order',
            'meta_query' => [[
                'key' => '_catakor_legacy_order_number',
                'value' => [$order_number, '#' . $order_number],
                'compare' => 'IN',
            ]],
        ]);

        if (ctype_digit($order_number)) {
            $native_order = wc_get_order((int) $order_number);
            if ($native_order) {
                $orders[] = $native_order;
            }
        }

        $checked = [];
        foreach ($orders as $order) {
            if (!$order instanceof WC_Order || isset($checked[$order->get_id()])) {
                continue;
            }
            $checked[$order->get_id()] = true;
            $billing_email = strtolower(trim((string) $order->get_billing_email()));
            if ($billing_email !== '' && hash_equals($billing_email, $email)) {
                return self::find_local_tracking_by_order_id((int) $order->get_id());
            }
        }

        return null;
    }

    private static function find_local_tracking_by_order_id(int $order_id)
    {
        global $wpdb;
        if ($order_id < 1 || !class_exists('ParcelPanel\\Models\\Table')) {
            return null;
        }

        $tracking_table = \ParcelPanel\Models\Table::$tracking;
        $items_table = \ParcelPanel\Models\Table::$tracking_items;
        return $wpdb->get_row($wpdb->prepare(
            "SELECT tracking.tracking_number, tracking.courier_code, tracking.fulfilled_at, item.order_id
             FROM {$tracking_table} AS tracking
             INNER JOIN {$items_table} AS item ON item.tracking_id = tracking.id
             WHERE item.order_id = %d
             ORDER BY item.id ASC
             LIMIT 1",
            $order_id
        ));
    }

    private static function fetch_bestfulfill_tracking(string $tracking_number): array
    {
        $cache_key = 'catakor_bestfulfill_v2_' . md5($tracking_number);
        $cached = get_transient($cache_key);
        if (is_array($cached)) {
            return $cached;
        }

        $url = 'https://www.bestfulfillpacket.com/openapi/v1/external/tracking?number=' . rawurlencode($tracking_number);
        $response = wp_remote_get($url, [
            'timeout' => 12,
            'redirection' => 3,
            'user-agent' => 'CatakorOrderTracking/1.0; ' . home_url('/'),
        ]);
        if (is_wp_error($response) || (int) wp_remote_retrieve_response_code($response) !== 200) {
            return [];
        }

        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        if (!is_array($data)) {
            return [];
        }

        $raw_events = isset($data['events']) && is_array($data['events']) ? $data['events'] : [];
        usort($raw_events, static function ($first, $second): int {
            $first_time = strtotime((string) ($first['time'] ?? '')) ?: 0;
            $second_time = strtotime((string) ($second['time'] ?? '')) ?: 0;
            return $second_time <=> $first_time;
        });

        $result = ['events' => []];
        foreach ($raw_events as $event) {
            if (!is_array($event)) {
                continue;
            }
            $raw_time = self::decode_tracking_text((string) ($event['time'] ?? ''));
            $timestamp = $raw_time !== '' ? strtotime($raw_time) : false;
            $result['events'][] = [
                'date' => $timestamp ? wp_date('Y-m-d H:i:s', $timestamp) : $raw_time,
                'location' => self::decode_tracking_text((string) ($event['location'] ?? '')),
                'message' => self::decode_tracking_text((string) ($event['content'] ?? '')),
            ];
        }

        if ($result['events']) {
            $result['date'] = (string) ($result['events'][0]['date'] ?? '');
            $result['status'] = (string) ($result['events'][0]['message'] ?? '');
        }

        $result = array_filter($result, static function ($value) {
            return $value !== '' && $value !== [];
        });
        set_transient($cache_key, $result, 15 * MINUTE_IN_SECONDS);
        return $result;
    }

    private static function decode_tracking_text(string $value): string
    {
        return trim(wp_strip_all_tags(html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }

    private static function suppress_order_emails(bool $suppress): void
    {
        $email_ids = [
            'new_order',
            'cancelled_order',
            'failed_order',
            'customer_on_hold_order',
            'customer_processing_order',
            'customer_completed_order',
            'customer_refunded_order',
            'customer_invoice',
            'customer_note',
            'customer_new_account',
            'customer_pp_in_transit_shipment',
            'customer_pp_out_for_delivery_shipment',
            'customer_pp_delivered_shipment',
            'customer_pp_exception_shipment',
            'customer_pp_failed_attempt_shipment',
        ];
        foreach ($email_ids as $email_id) {
            $hook = 'woocommerce_email_enabled_' . $email_id;
            if ($suppress) {
                add_filter($hook, '__return_false', 9999);
            } else {
                remove_filter($hook, '__return_false', 9999);
            }
        }
    }

    private static function country_code(string $country): string
    {
        $country = trim($country);
        if ($country === '' || strlen($country) === 2) {
            return strtoupper($country);
        }
        $countries = WC()->countries->get_countries();
        $code = array_search($country, $countries, true);
        return $code !== false ? (string) $code : $country;
    }

    private static function first_name(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name), 2);
        return sanitize_text_field($parts[0] ?? '');
    }

    private static function last_name(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name), 2);
        return sanitize_text_field($parts[1] ?? '');
    }

    private static function money($value): float
    {
        return (float) wc_format_decimal((string) $value, wc_get_price_decimals());
    }
}

Catakor_Shopify_Order_Migrator::init();
