<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_GET['action'] = 'save_property';
$_POST = [];
// Bypass getJsonInput
require 'config.php';
$data = [
        'id' => null,
        'title' => 'Test',
        'type' => 'Villas',
        'totalprice' => 50000,
        'area' => 100,
        'pricePerMeter' => 500,
        'owner' => 'test',
        'lat' => 0,
        'lng' => 0,
        'address' => 'Cairo',
        'description' => 'Desc',
        'images' => [],
        'createdBy' => 1
    ];
    
        try {
            $imagesJson = isset($data['images']) ? json_encode($data['images']) : '[]';
            $polygonJson = isset($data['polygon']) ? json_encode($data['polygon']) : '[]';
            $parent = isset($data['parent_building_id']) ? $data['parent_building_id'] : null;
            $id = isset($data['id']) ? $data['id'] : null;
            
                $stmt = $conn->prepare("INSERT INTO properties (title, type, price, location_lat, location_lng, address, description, image_url, created_by, polygon, owner, owner_phone, area, price_per_meter, drive_link, images, parent_building_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['title'] ?? 'Untitled',
                    $data['type'] ?? 'Property',
                    $data['totalprice'] ?? 0,
                    isset($data['centroid']) && $data['centroid'] ? ($data['centroid']['lat'] ?? 0) : ($data['lat'] ?? 0),
                    isset($data['centroid']) && $data['centroid'] ? ($data['centroid']['lng'] ?? 0) : ($data['lng'] ?? 0),
                    $data['address'] ?? ($data['location'] ?? ''),
                    $data['description'] ?? '',
                    $data['image'] ?? ($data['imageUrl'] ?? ''),
                    $data['createdBy'] ?? null,
                    $polygonJson,
                    $data['owner'] ?? '',
                    $data['ownerPhone'] ?? '',
                    $data['buildingArea'] ?? ($data['area'] ?? 0),
                    $data['pricePerMeter'] ?? 0,
                    $data['driveLink'] ?? '',
                    $imagesJson,
                    $parent
                ]);
                echo "Success: Property Saved via Test Script";
        } catch (Exception $e) {
            echo "SQL Error in save_property: " . $e->getMessage() . "\n";
        }
?>
