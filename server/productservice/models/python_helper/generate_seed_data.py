import os
import json

# Đường dẫn tới thư mục images
IMAGE_BASE_PATH = "d:/Luận văn chuyên nghành 2025-2026/Smartbuy-web-ori/smartbuy-web/client/src/assets/images"

# Map tên thư mục với tên sản phẩm chuẩn
FOLDER_NAME_MAP = {
    "Iphone13": "iPhone 13",
    "IPhone14": "iPhone 14",
    "iPhone 15thường_15Plus": "iPhone 15",
    "iPhone 16": "iPhone 16",
    "Iphone 16 promax": "iPhone 16 Pro Max",
    "Iphone17 pro": "iPhone 17 Pro",
    "Iphone17 promax": "iPhone 17 Pro Max",
    "iPhone Air": "iPhone Air"
}

# Thông tin sản phẩm (giá và thông số)
PRODUCTS_INFO = {
    # APPLE PRODUCTS
    "iPhone 13": {
        "price": 17990000,
        "discount": 10,
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
        "price": 21990000,
        "discount": 8,
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
        "price": 25990000,
        "discount": 5,
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
        "price": 28990000,
        "discount": 3,
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
        "price": 39990000,
        "discount": 2,
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
        "price": 35990000,
        "discount": 0,
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
        "price": 42990000,
        "discount": 0,
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
        "price": 19990000,
        "discount": 5,
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
    }
}

def slugify(text):
    """Convert text to slug"""
    text = text.lower()
    text = text.replace(" ", "-")
    return text

def scan_images_folder(brand_folder):
    """Scan thư mục hình ảnh và trả về cấu trúc sản phẩm"""
    products_data = []
    brand_path = os.path.join(IMAGE_BASE_PATH, brand_folder)
    
    if not os.path.exists(brand_path):
        print(f"❌ Không tìm thấy thư mục: {brand_path}")
        return products_data
    
    # Duyệt qua từng sản phẩm
    for folder_name in os.listdir(brand_path):
        folder_path = os.path.join(brand_path, folder_name)
        if not os.path.isdir(folder_path):
            continue
        
        # Map tên thư mục sang tên sản phẩm chuẩn
        product_name = FOLDER_NAME_MAP.get(folder_name, folder_name)
        product_path = folder_path
            
        # Lấy thông tin sản phẩm
        if product_name not in PRODUCTS_INFO:
            print(f"⚠️  Chưa có thông tin cho: {folder_name} -> {product_name}")
            continue
            
        info = PRODUCTS_INFO[product_name]
        
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
                    img_url = f"/src/assets/images/{brand_folder}/{product_name}/{color_name}/{img_file}"
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
            "brand": "Apple",
            "category": "Điện thoại",
            "specifications": specs,
            "variants": variants,
            "images": images
        }
        
        products_data.append(product)
        print(f"✅ Đã quét: {product_name} - {len(colors)} màu, {len(images)} ảnh")
    
    return products_data

def generate_seed_data():
    """Generate seed data cho tất cả iPhone"""
    print("🔍 Đang quét thư mục iPhone...")
    
    products = scan_images_folder("IPhoneImages")
    
    # Load template
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
            {"ram": "4GB", "rom": "64GB", "chipset": None},
            {"ram": "4GB", "rom": "128GB", "chipset": None},
            {"ram": "6GB", "rom": "128GB", "chipset": None},
            {"ram": "6GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "128GB", "chipset": None},
            {"ram": "8GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "512GB", "chipset": None},
            {"ram": "8GB", "rom": "1TB", "chipset": None}
        ],
        "products": products
    }
    
    # Lưu ra file
    output_file = "seed_data_iphone.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Đã tạo file: {output_file}")
    print(f"📦 Tổng số sản phẩm: {len(products)}")

if __name__ == "__main__":
    generate_seed_data()
