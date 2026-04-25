<?php
require_once 'config.php';

// Enable tactical transparency during sync stabilization
error_reporting(E_ALL);
ini_set('display_errors', 1);

$action = $_GET['action'] ?? '';
$data = getJsonInput(); // Using helper from config.php


// Tactical Multi-Column Sync Logic
switch ($action) {
    case 'login':
        try {
            $email = isset($data['email']) ? trim($data['email']) : '';
            $password = isset($data['password']) ? trim($data['password']) : '';

            $stmt = $conn->prepare("SELECT id, name, email, role, phone, profile_pic as profilePic, password FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && $user['password'] === $password) {
                unset($user['password']);
                sendResponse("success", "Tactical Link Established", $user);
            } else {
                sendResponse("error", "Access Denied: Credentials Mismatch");
            }
        } catch (Exception $e) {
            sendResponse("error", "Login System Fault: " . $e->getMessage());
        }
        break;

    case 'update_user':
        try {
            $stmt = $conn->prepare("UPDATE users SET name = ?, phone = ?, password = ?, profile_pic = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['phone'],
                $data['password'],
                $data['profilePic'] ?? null,
                $data['id']
            ]);
            sendResponse("success", "Profile Matrix Synchronized");
        } catch (Exception $e) {
            sendResponse("error", "Update Error: " . $e->getMessage());
        }
        break;

    case 'get_initial_data':
        try {
            $uid = $_GET['userId'] ?? 0;
            $role = $_GET['role'] ?? '';
            $out = [];
            $out['users'] = $conn->query("SELECT id, name, email, role, phone, profile_pic as profilePic FROM users")->fetchAll(PDO::FETCH_ASSOC);
            $out['properties'] = $conn->query("SELECT * FROM properties")->fetchAll(PDO::FETCH_ASSOC);
            $out['tasks'] = $conn->query("SELECT * FROM tasks ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
            $out['leads'] = $conn->query("SELECT * FROM leads ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
            $out['files'] = $conn->query("SELECT * FROM files")->fetchAll(PDO::FETCH_ASSOC);
            $out['messages'] = $conn->query("SELECT * FROM messages")->fetchAll(PDO::FETCH_ASSOC);
            sendResponse("success", "Global Sync Complete", $out);
        } catch (Exception $e) {
            sendResponse("error", "Data Extraction Interrupted: " . $e->getMessage());
        }
        break;

    case 'add_user':
        try {
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['password'],
                $data['role'],
                $data['phone'] ?? '+20000000000'
            ]);
            sendResponse("success", "Personnel Asset Authorized");
        } catch (Exception $e) {
            sendResponse("error", "Onboarding Refused: " . $e->getMessage());
        }
        break;

    case 'save_task':
        try {
            $stmt = $conn->prepare("INSERT INTO tasks (title, description, assigned_to, assigned_by, due_date, status) VALUES (?, ?, ?, ?, ?, 'pending')");
            $stmt->execute([
                $data['title'],
                $data['description'] ?? '',
                $data['assigned_to'] ?? null, // Now handles 'all' or comma-separated IDs
                $data['assigned_by'] ?? 0,
                $data['due_date'] ?? null
            ]);
            sendResponse("success", "Mission Objective Logged");
        } catch (Exception $e) {
            sendResponse("error", "Mission Deployment Failed: " . $e->getMessage());
        }
        break;

    case 'save_message':
        try {
            $stmt = $conn->prepare("INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, 0)");
            $stmt->execute([
                $data['sender_id'],
                $data['receiver_id'], // 'all' or specific ID
                $data['content']
            ]);
            sendResponse("success", "Communication Transmitted");
        } catch (Exception $e) {
            sendResponse("error", "Transmission Intercepted: " . $e->getMessage());
        }
        break;

    case 'save_lead':
        try {
            $stmt = $conn->prepare("INSERT INTO leads (client_name, client_phone, client_ig, submitted_by) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['client_name'],
                $data['client_phone'],
                $data['client_ig'] ?? '',
                $data['submitted_by'] ?? 0
            ]);
            sendResponse("success", "Intelligence Intel Archived");
        } catch (Exception $e) {
            sendResponse("error", "Intel Sync Timeout: " . $e->getMessage());
        }
        break;

    case 'save_property':
        try {
            $imagesJson = isset($data['images']) ? json_encode($data['images']) : '[]';
            $polygonJson = isset($data['polygon']) ? json_encode($data['polygon']) : '[]';
            $parent = $data['parent_building_id'] ?? null;
            $title = $data['title'] ?? 'Untitled';
            $type = $data['type'] ?? 'Property';

            // Robust Price Handling
            $price = 0;
            if (isset($data['totalprice']))
                $price = $data['totalprice'];
            else if (isset($data['totalPrice']))
                $price = $data['totalPrice'];
            else if (isset($data['price']))
                $price = $data['price'];

            $lat = isset($data['centroid']) && $data['centroid'] ? ($data['centroid']['lat'] ?? 0) : ($data['lat'] ?? 0);
            $lng = isset($data['centroid']) && $data['centroid'] ? ($data['centroid']['lng'] ?? 0) : ($data['lng'] ?? 0);
            $address = $data['address'] ?? ($data['location'] ?? '');
            $description = $data['description'] ?? '';
            $image_url = $data['image'] ?? ($data['imageUrl'] ?? '');
            $created_by = $data['createdBy'] ?? null;
            $owner = $data['owner'] ?? '';
            $owner_phone = $data['ownerPhone'] ?? '';

            // Robust Area Handling
            $area = 0;
            if (isset($data['buildingArea']))
                $area = $data['buildingArea'];
            else if (isset($data['area']))
                $area = $data['area'];

            $price_per_meter = $data['pricePerMeter'] ?? ($area > 0 ? $price / $area : 0);
            $drive_link = $data['driveLink'] ?? '';

            if (isset($data['id']) && $data['id']) {
                $stmt = $conn->prepare("UPDATE properties SET title=?, type=?, price=?, location_lat=?, location_lng=?, address=?, description=?, image_url=?, polygon=?, owner=?, owner_phone=?, area=?, price_per_meter=?, drive_link=?, images=?, parent_building_id=? WHERE id=?");
                $stmt->execute([
                    $title,
                    $type,
                    $price,
                    $lat,
                    $lng,
                    $address,
                    $description,
                    $image_url,
                    $polygonJson,
                    $owner,
                    $owner_phone,
                    $area,
                    $price_per_meter,
                    $drive_link,
                    $imagesJson,
                    $parent,
                    $data['id']
                ]);
                sendResponse("success", "Sector Asset Updated and Synchronized", $data['id']);
            } else {
                $stmt = $conn->prepare("INSERT INTO properties (title, type, price, location_lat, location_lng, address, description, image_url, created_by, polygon, owner, owner_phone, area, price_per_meter, drive_link, images, parent_building_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $title,
                    $type,
                    $price,
                    $lat,
                    $lng,
                    $address,
                    $description,
                    $image_url,
                    $created_by,
                    $polygonJson,
                    $owner,
                    $owner_phone,
                    $area,
                    $price_per_meter,
                    $drive_link,
                    $imagesJson,
                    $parent
                ]);
                $newId = $conn->lastInsertId();
                sendResponse("success", "Sector Asset Registered and Synchronized", $newId);
            }
        } catch (Exception $e) {
            sendResponse("error", "Asset Registration/Update Denied: " . $e->getMessage());
        }
        break;

    case 'mark_message_seen':
        try {
            $stmt = $conn->prepare("UPDATE messages SET is_read = 1 WHERE id = ?");
            $stmt->execute([$data['id']]);
            sendResponse("success", "Message Acknowledged");
        } catch (Exception $e) {
            sendResponse("error", "Acknowledgment Failed: " . $e->getMessage());
        }
        break;

    case 'update_task_status':
        try {
            $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            sendResponse("success", "Operational Status Synchronized");
        } catch (Exception $e) {
            sendResponse("error", "Status Uplink Failure: " . $e->getMessage());
        }
        break;

    case 'save_file':
        try {
            $stmt = $conn->prepare("INSERT INTO files (name, type, size, url, uploaded_by) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['type'],
                $data['size'],
                $data['content'], // Base64 content stored in URL column for simplicity in this MVP
                $data['uploadedById']
            ]);
            sendResponse("success", "Material Archived in Sector Files");
        } catch (Exception $e) {
            sendResponse("error", "File Sync Denied: " . $e->getMessage());
        }
        break;

    case 'delete_file':
        try {
            $stmt = $conn->prepare("DELETE FROM files WHERE id = ?");
            $stmt->execute([$data['id']]);
            sendResponse("success", "Material Erased from Sector");
        } catch (Exception $e) {
            sendResponse("error", "File Erasure Denied: " . $e->getMessage());
        }
        break;

    case 'delete_property':
        try {
            if (!isset($data['id'])) {
                sendResponse("error", "Asset ID Missing");
                break;
            }
            $stmt = $conn->prepare("DELETE FROM properties WHERE id = ?");
            $stmt->execute([$data['id']]);
            sendResponse("success", "Sector Asset Erased from Database");
        } catch (Exception $e) {
            sendResponse("error", "Asset Erasure Failed: " . $e->getMessage());
        }
        break;

    default:
        sendResponse("error", "Command Not Recognized by HQ");
        break;
}
?>