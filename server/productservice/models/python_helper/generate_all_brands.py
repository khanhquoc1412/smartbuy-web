import os
import json

# Đường dẫn tới thư mục images
IMAGE_BASE_PATH = "d:/Luận văn chuyên nghành 2025-2026/Smartbuy-web-ori/smartbuy-web/client/src/assets/images"

# Thông tin tất cả sản phẩm
ALL_PRODUCTS_INFO = {
    # ========== APPLE ==========
    "iPhone 13": {
        "brand": "Apple",
        "price": 17990000, "discount": 10,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, 2532 x 1170 pixels",
            "Camera sau": "Camera kép 12MP (Wide + Ultra Wide)",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A15 Bionic",
            "Pin": "3240 mAh",
            "Hệ điều hành": "iOS 15",
        },
        "memories": [
            {"ram": "4GB", "rom": "128GB", "price": 17990000},
            {"ram": "4GB", "rom": "256GB", "price": 19990000}
        ]
    },
    "iPhone 14": {
        "brand": "Apple",
        "price": 21990000, "discount": 8,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED",
            "Camera sau": "Camera kép 12MP, Photonic Engine",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A15 Bionic",
            "Pin": "3279 mAh",
            "Hệ điều hành": "iOS 16",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 21990000},
            {"ram": "6GB", "rom": "256GB", "price": 24990000}
        ]
    },
    "iPhone 15": {
        "brand": "Apple",
        "price": 25990000, "discount": 5,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, Dynamic Island",
            "Camera sau": "Camera chính 48MP + Ultra Wide 12MP",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A16 Bionic",
            "Pin": "3349 mAh",
            "Hệ điều hành": "iOS 17",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 25990000},
            {"ram": "6GB", "rom": "256GB", "price": 28990000}
        ]
    },
    "iPhone 16": {
        "brand": "Apple",
        "price": 28990000, "discount": 3,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, Dynamic Island",
            "Camera sau": "Camera Fusion 48MP + Ultra Wide 12MP",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A18",
            "Pin": "3561 mAh",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 28990000},
            {"ram": "8GB", "rom": "256GB", "price": 31990000}
        ]
    },
    "iPhone 16 Pro Max": {
        "brand": "Apple",
        "price": 39990000, "discount": 2,
        "specs": {
            "Màn hình": "6.9 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera Fusion 48MP + Ultra Wide 48MP + Telephoto 5x 12MP",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A18 Pro",
            "Pin": "4685 mAh",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 39990000},
            {"ram": "8GB", "rom": "512GB", "price": 44990000},
            {"ram": "8GB", "rom": "1TB", "price": 49990000}
        ]
    },
    "iPhone 17 Pro": {
        "brand": "Apple",
        "price": 35990000, "discount": 0,
        "specs": {
            "Màn hình": "6.3 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera chính 48MP + Ultra Wide 48MP + Telephoto 3x",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A19 Pro",
            "Pin": "3800 mAh",
            "Hệ điều hành": "iOS 19",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 35990000},
            {"ram": "8GB", "rom": "512GB", "price": 40990000}
        ]
    },
    "iPhone 17 Pro Max": {
        "brand": "Apple",
        "price": 42990000, "discount": 0,
        "specs": {
            "Màn hình": "6.9 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera chính 48MP + Ultra Wide 48MP + Telephoto 5x",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A19 Pro",
            "Pin": "4800 mAh",
            "Hệ điều hành": "iOS 19",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 42990000},
            {"ram": "8GB", "rom": "512GB", "price": 47990000},
            {"ram": "8GB", "rom": "1TB", "price": 52990000}
        ]
    },
    "iPhone Air": {
        "brand": "Apple",
        "price": 19990000, "discount": 5,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED",
            "Camera sau": "Camera kép 12MP",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A16 Bionic",
            "Pin": "3200 mAh",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 19990000},
            {"ram": "6GB", "rom": "256GB", "price": 22990000}
        ]
    },
    
    # ========== SAMSUNG ==========
    "Samsung Galaxy A06 5G": {
        "brand": "Samsung",
        "price": 4290000, "discount": 5,
        "specs": {
            "Màn hình": "6.7 inch, PLS LCD, HD+",
            "Camera sau": "50MP + 2MP",
            "Camera trước": "8MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "4GB", "rom": "64GB", "price": 4290000},
            {"ram": "4GB", "rom": "128GB", "price": 4990000}
        ]
    },
    "Samsung Galaxy A07": {
        "brand": "Samsung",
        "price": 3390000, "discount": 3,
        "specs": {
            "Màn hình": "6.6 inch, PLS LCD, HD+",
            "Camera sau": "50MP + 2MP",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G85",
            "Pin": "5000 mAh",
            "Hệ điều hành": "Android 14, One UI 6",
        },
        "memories": [
            {"ram": "3GB", "rom": "32GB", "price": 2990000},
            {"ram": "4GB", "rom": "64GB", "price": 3390000}
        ]
    },
    "Samsung Galaxy A36 5G": {
        "brand": "Samsung",
        "price": 8990000, "discount": 8,
        "specs": {
            "Màn hình": "6.6 inch, Super AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP + 8MP + 5MP",
            "Camera trước": "13MP",
            "Chip": "Snapdragon 7 Gen 1",
            "Pin": "5000 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 8990000},
            {"ram": "8GB", "rom": "256GB", "price": 10990000}
        ]
    },
    "Samsung Galaxy A56 5G": {
        "brand": "Samsung",
        "price": 11990000, "discount": 10,
        "specs": {
            "Màn hình": "6.7 inch, Super AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 12MP + 5MP",
            "Camera trước": "32MP",
            "Chip": "Exynos 1480",
            "Pin": "5000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 11990000},
            {"ram": "8GB", "rom": "256GB", "price": 13990000}
        ]
    },
    "Samsung Galaxy S24 5G": {
        "brand": "Samsung",
        "price": 21990000, "discount": 12,
        "specs": {
            "Màn hình": "6.2 inch, Dynamic AMOLED 2X, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 12MP Ultra Wide + 10MP Telephoto 3x",
            "Camera trước": "12MP",
            "Chip": "Exynos 2400",
            "Pin": "4000 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 21990000},
            {"ram": "8GB", "rom": "512GB", "price": 24990000}
        ]
    },
    "Samsung Galaxy S25 FE": {
        "brand": "Samsung",
        "price": 15990000, "discount": 8,
        "specs": {
            "Màn hình": "6.4 inch, Dynamic AMOLED 2X, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 12MP Ultra Wide + 8MP Telephoto 3x",
            "Camera trước": "10MP",
            "Chip": "Snapdragon 8 Gen 2",
            "Pin": "4500 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 15990000},
            {"ram": "8GB", "rom": "256GB", "price": 17990000}
        ]
    },
    "Samsung Galaxy Z Flip7 5G": {
        "brand": "Samsung",
        "price": 26990000, "discount": 5,
        "specs": {
            "Màn hình": "6.7 inch Dynamic AMOLED 2X (gập), 1.9 inch (phụ), 120Hz",
            "Camera sau": "12MP Wide + 12MP Ultra Wide",
            "Camera trước": "10MP",
            "Chip": "Snapdragon 8 Gen 3",
            "Pin": "3700 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 26990000},
            {"ram": "8GB", "rom": "512GB", "price": 29990000}
        ]
    },
    "Samsung Galaxy Z Fold7 5G": {
        "brand": "Samsung",
        "price": 43990000, "discount": 3,
        "specs": {
            "Màn hình": "7.6 inch Dynamic AMOLED 2X (trong), 6.2 inch (ngoài), 120Hz",
            "Camera sau": "50MP Wide + 12MP Ultra Wide + 10MP Telephoto 3x",
            "Camera trước": "10MP (ngoài) + 4MP (trong)",
            "Chip": "Snapdragon 8 Gen 3",
            "Pin": "4400 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "12GB", "rom": "256GB", "price": 43990000},
            {"ram": "12GB", "rom": "512GB", "price": 47990000},
            {"ram": "12GB", "rom": "1TB", "price": 52990000}
        ]
    },
}

# Map tên thư mục với tên sản phẩm chuẩn
FOLDER_NAME_MAP = {
    # APPLE
    "Iphone13": "iPhone 13",
    "IPhone14": "iPhone 14",
    "iPhone 15thường_15Plus": "iPhone 15",
    "iPhone 16": "iPhone 16",
    "Iphone 16 promax": "iPhone 16 Pro Max",
    "Iphone17 pro": "iPhone 17 Pro",
    "Iphone17 promax": "iPhone 17 Pro Max",
    "iPhone Air": "iPhone Air",
    # SAMSUNG - tên thư mục đã chuẩn
}

# Map thương hiệu với folder
BRAND_FOLDERS = {
    "Apple": "IPhoneImages",
    "Samsung": "SamsungImages",
    "Xiaomi": "XiaomiImages",
    "OPPO": "OppoImages",
    "Vivo": "VivoImages",
    "Realme": "RealmeImages",
    "HONOR": "honorImages"
}

def slugify(text):
    """Convert text to slug"""
    text = text.lower()
    text = text.replace(" ", "-")
    return text

def scan_brand_products(brand_name, brand_folder):
    """Scan tất cả sản phẩm của một thương hiệu"""
    products_data = []
    brand_path = os.path.join(IMAGE_BASE_PATH, brand_folder)
    
    if not os.path.exists(brand_path):
        print(f"❌ Không tìm thấy thư mục: {brand_path}")
        return products_data
    
    print(f"\n📱 Đang quét {brand_name}...")
    
    # Duyệt qua từng sản phẩm
    for folder_name in os.listdir(brand_path):
        folder_path = os.path.join(brand_path, folder_name)
        if not os.path.isdir(folder_path):
            continue
        
        # Map tên thư mục sang tên sản phẩm chuẩn
        product_name = FOLDER_NAME_MAP.get(folder_name, folder_name)
        product_path = folder_path
            
        # Lấy thông tin sản phẩm
        if product_name not in ALL_PRODUCTS_INFO:
            print(f"   ⚠️  Chưa có thông tin cho: {folder_name}")
            continue
            
        info = ALL_PRODUCTS_INFO[product_name]
        
        # Scan màu sắc
        colors = []
        images = []
        variants = []
        
        for color_name in os.listdir(product_path):
            color_path = os.path.join(product_path, color_name)
            if not os.path.isdir(color_path):
                continue
                
            colors.append(color_name)
            
            # Scan hình ảnh trong mỗi màu
            color_images = []
            for img_file in os.listdir(color_path):
                if img_file.endswith(('.jpg', '.png', '.webp')):
                    img_url = f"/src/assets/images/{brand_folder}/{folder_name}/{color_name}/{img_file}"
                    color_images.append({
                        "color": color_name,
                        "name": f"{product_name} {color_name} - {len(color_images) + 1}",
                        "imageUrl": img_url
                    })
            
            images.extend(color_images)
            
            # Tạo variants cho mỗi màu + memory
            for mem in info["memories"]:
                variants.append({
                    "color": color_name,
                    "memory": {"ram": mem["ram"], "rom": mem["rom"]},
                    "price": mem["price"],
                    "stock": 50
                })
        
        # Lấy thumb URL (hình đầu tiên)
        thumb_url = images[0]["imageUrl"] if images else ""
        
        # Tạo specifications
        specs = []
        for spec_name, spec_value in info["specs"].items():
            specs.append({
                "specName": spec_name,
                "specValue": spec_value
            })
        
        # Tạo product object
        product = {
            "name": product_name,
            "description": f"{product_name} - Điện thoại cao cấp",
            "thumbUrl": thumb_url,
            "discountPercentage": info["discount"],
            "slug": slugify(product_name),
            "basePrice": info["price"],
            "brand": brand_name,
            "category": "Điện thoại",
            "specifications": specs,
            "variants": variants,
            "images": images
        }
        
        products_data.append(product)
        print(f"   ✅ {product_name}: {len(colors)} màu, {len(images)} ảnh")
    
    return products_data

def generate_all_seed_data(brands_to_scan=None):
    """Generate seed data cho tất cả hoặc một số thương hiệu"""
    if brands_to_scan is None:
        brands_to_scan = ["Apple", "Samsung"]  # Mặc định quét Apple và Samsung
    
    print("🔍 Bắt đầu quét dữ liệu...")
    
    all_products = []
    for brand in brands_to_scan:
        if brand in BRAND_FOLDERS:
            products = scan_brand_products(brand, BRAND_FOLDERS[brand])
            all_products.extend(products)
    
    # Tạo seed data template
    seed_data = {
        "categories": [{"name": "Điện thoại", "nameAscii": "dien-thoai"}],
        "brands": [
            {"name": "Apple", "nameAscii": "apple"},
            {"name": "Samsung", "nameAscii": "samsung"},
            {"name": "Xiaomi", "nameAscii": "xiaomi"},
            {"name": "OPPO", "nameAscii": "oppo"},
            {"name": "Vivo", "nameAscii": "vivo"},
            {"name": "Realme", "nameAscii": "realme"},
            {"name": "HONOR", "nameAscii": "honor"}
        ],
        "specifications": [
            {"specName": "Màn hình"},
            {"specName": "Camera sau"},
            {"specName": "Camera trước"},
            {"specName": "Chip"},
            {"specName": "Pin"},
            {"specName": "Hệ điều hành"}
        ],
        "colors": [
            {"name": "Đen", "code": "#000000"},
            {"name": "Trắng", "code": "#FFFFFF"},
            {"name": "Xanh", "code": "#0066CC"},
            {"name": "Hồng", "code": "#FFC0CB"},
            {"name": "Xám", "code": "#808080"},
            {"name": "Vàng", "code": "#FFD700"},
            {"name": "Bạc", "code": "#C0C0C0"},
            {"name": "Tím", "code": "#9370DB"},
            {"name": "Cam", "code": "#FF8C00"},
            {"name": "Xanh lá", "code": "#00CC66"},
            {"name": "Xanh dương", "code": "#0066FF"},
            {"name": "Xanh lưu ly", "code": "#4682B4"},
            {"name": "Xanh mồng két", "code": "#48D1CC"},
            {"name": "Xanh nhạt", "code": "#87CEEB"}
        ],
        "memories": [
            {"ram": "3GB", "rom": "32GB", "chipset": None},
            {"ram": "4GB", "rom": "64GB", "chipset": None},
            {"ram": "4GB", "rom": "128GB", "chipset": None},
            {"ram": "6GB", "rom": "128GB", "chipset": None},
            {"ram": "6GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "128GB", "chipset": None},
            {"ram": "8GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "512GB", "chipset": None},
            {"ram": "8GB", "rom": "1TB", "chipset": None},
            {"ram": "12GB", "rom": "256GB", "chipset": None},
            {"ram": "12GB", "rom": "512GB", "chipset": None},
            {"ram": "12GB", "rom": "1TB", "chipset": None}
        ],
        "products": all_products
    }
    
    # Lưu ra file
    output_file = "seed_data_" + "_".join([b.lower() for b in brands_to_scan]) + ".json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Đã tạo file: {output_file}")
    print(f"📦 Tổng số sản phẩm: {len(all_products)}")
    
    for brand in brands_to_scan:
        count = len([p for p in all_products if p["brand"] == brand])
        print(f"   - {brand}: {count} sản phẩm")

if __name__ == "__main__":
    # Có thể chọn thương hiệu cần quét
    # generate_all_seed_data(["Apple"])  # Chỉ Apple
    generate_all_seed_data(["Apple", "Samsung"])  # Apple + Samsung
    # generate_all_seed_data()  # Tất cả (mặc định Apple + Samsung)
