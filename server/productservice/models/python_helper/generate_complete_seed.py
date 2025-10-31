import os
import json

# Đường dẫn tới thư mục images
IMAGE_BASE_PATH = "d:/Luận văn chuyên nghành 2025-2026/Smartbuy-web-ori/smartbuy-web/client/src/assets/images"

# THÔNG TIN ĐẦY ĐỦ TẤT CẢ SẢN PHẨM (47 sản phẩm)
ALL_PRODUCTS_INFO = {
    # ==================== APPLE (8 sản phẩm) ====================
    "iPhone 13": {
        "brand": "Apple", "price": 17990000, "discount": 10,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, 2532 x 1170 pixels",
            "Camera sau": "Camera kép 12MP (Wide + Ultra Wide)",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A15 Bionic",
            "Pin": "3240 mAh, sạc nhanh 20W",
            "Hệ điều hành": "iOS 15",
        },
        "memories": [
            {"ram": "4GB", "rom": "128GB", "price": 17990000},
            {"ram": "4GB", "rom": "256GB", "price": 19990000}
        ]
    },
    "iPhone 14": {
        "brand": "Apple", "price": 21990000, "discount": 8,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, 2532 x 1170 pixels",
            "Camera sau": "Camera kép 12MP, Photonic Engine",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A15 Bionic",
            "Pin": "3279 mAh, sạc nhanh 20W",
            "Hệ điều hành": "iOS 16",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 21990000},
            {"ram": "6GB", "rom": "256GB", "price": 24990000}
        ]
    },
    "iPhone 15": {
        "brand": "Apple", "price": 25990000, "discount": 5,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, Dynamic Island",
            "Camera sau": "Camera chính 48MP + Ultra Wide 12MP",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A16 Bionic",
            "Pin": "3349 mAh, sạc nhanh 20W",
            "Hệ điều hành": "iOS 17",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 25990000},
            {"ram": "6GB", "rom": "256GB", "price": 28990000}
        ]
    },
    "iPhone 16": {
        "brand": "Apple", "price": 28990000, "discount": 3,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED, Dynamic Island",
            "Camera sau": "Camera Fusion 48MP + Ultra Wide 12MP",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A18",
            "Pin": "3561 mAh, sạc nhanh 25W",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 28990000},
            {"ram": "8GB", "rom": "256GB", "price": 31990000}
        ]
    },
    "iPhone 16 Pro Max": {
        "brand": "Apple", "price": 39990000, "discount": 2,
        "specs": {
            "Màn hình": "6.9 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera Fusion 48MP + Ultra Wide 48MP + Telephoto 5x 12MP",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A18 Pro",
            "Pin": "4685 mAh, sạc nhanh 45W",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 39990000},
            {"ram": "8GB", "rom": "512GB", "price": 44990000},
            {"ram": "8GB", "rom": "1TB", "price": 49990000}
        ]
    },
    "iPhone 17 Pro": {
        "brand": "Apple", "price": 35990000, "discount": 0,
        "specs": {
            "Màn hình": "6.3 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera chính 48MP + Ultra Wide 48MP + Telephoto 3x",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A19 Pro",
            "Pin": "3800 mAh, sạc nhanh 30W",
            "Hệ điều hành": "iOS 19",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 35990000},
            {"ram": "8GB", "rom": "512GB", "price": 40990000}
        ]
    },
    "iPhone 17 Pro Max": {
        "brand": "Apple", "price": 42990000, "discount": 0,
        "specs": {
            "Màn hình": "6.9 inch, Super Retina XDR LTPO, ProMotion 120Hz",
            "Camera sau": "Camera chính 48MP + Ultra Wide 48MP + Telephoto 5x",
            "Camera trước": "12MP TrueDepth Autofocus",
            "Chip": "Apple A19 Pro",
            "Pin": "4800 mAh, sạc nhanh 45W",
            "Hệ điều hành": "iOS 19",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 42990000},
            {"ram": "8GB", "rom": "512GB", "price": 47990000},
            {"ram": "8GB", "rom": "1TB", "price": 52990000}
        ]
    },
    "iPhone Air": {
        "brand": "Apple", "price": 19990000, "discount": 5,
        "specs": {
            "Màn hình": "6.1 inch, Super Retina XDR OLED",
            "Camera sau": "Camera kép 12MP",
            "Camera trước": "12MP TrueDepth",
            "Chip": "Apple A16 Bionic",
            "Pin": "3200 mAh, sạc nhanh 20W",
            "Hệ điều hành": "iOS 18",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 19990000},
            {"ram": "6GB", "rom": "256GB", "price": 22990000}
        ]
    },
    
    # ==================== SAMSUNG (8 sản phẩm) ====================
    "Samsung Galaxy A06 5G": {
        "brand": "Samsung", "price": 4290000, "discount": 5,
        "specs": {
            "Màn hình": "6.7 inch, PLS LCD, HD+, 90Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh, sạc nhanh 25W",
            "Hệ điều hành": "Android 14, One UI 6.1",
        },
        "memories": [
            {"ram": "4GB", "rom": "64GB", "price": 4290000},
            {"ram": "4GB", "rom": "128GB", "price": 4990000}
        ]
    },
    "Samsung Galaxy A07": {
        "brand": "Samsung", "price": 3390000, "discount": 3,
        "specs": {
            "Màn hình": "6.6 inch, PLS LCD, HD+",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G85",
            "Pin": "5000 mAh, sạc 15W",
            "Hệ điều hành": "Android 14, One UI 6",
        },
        "memories": [
            {"ram": "3GB", "rom": "32GB", "price": 2990000},
            {"ram": "4GB", "rom": "64GB", "price": 3390000}
        ]
    },
    "Samsung Galaxy A36 5G": {
        "brand": "Samsung", "price": 8990000, "discount": 8,
        "specs": {
            "Màn hình": "6.6 inch, Super AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 8MP Ultra Wide + 5MP Macro",
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
        "brand": "Samsung", "price": 11990000, "discount": 10,
        "specs": {
            "Màn hình": "6.7 inch, Super AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 12MP Ultra Wide + 5MP Macro",
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
        "brand": "Samsung", "price": 21990000, "discount": 12,
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
        "brand": "Samsung", "price": 15990000, "discount": 8,
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
        "brand": "Samsung", "price": 26990000, "discount": 5,
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
        "brand": "Samsung", "price": 43990000, "discount": 3,
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
    
    # ==================== XIAOMI (8 sản phẩm) ====================
    "Xiaomi 14T 5G": {
        "brand": "Xiaomi", "price": 12990000, "discount": 10,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, 1.5K, 144Hz",
            "Camera sau": "50MP OIS + 50MP Telephoto 2x + 12MP Ultra Wide",
            "Camera trước": "32MP",
            "Chip": "MediaTek Dimensity 8300 Ultra",
            "Pin": "5000 mAh, sạc nhanh 67W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 12990000},
            {"ram": "12GB", "rom": "512GB", "price": 14990000}
        ]
    },
    "Xiaomi Redmi 14C": {
        "brand": "Xiaomi", "price": 2990000, "discount": 5,
        "specs": {
            "Màn hình": "6.88 inch, IPS LCD, HD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Helio G81 Ultra",
            "Pin": "5160 mAh, sạc 18W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "4GB", "rom": "128GB", "price": 2990000},
            {"ram": "6GB", "rom": "256GB", "price": 3490000}
        ]
    },
    "Xiaomi Redmi 15": {
        "brand": "Xiaomi", "price": 3990000, "discount": 7,
        "specs": {
            "Màn hình": "6.74 inch, IPS LCD, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "13MP",
            "Chip": "Snapdragon 4 Gen 2",
            "Pin": "5000 mAh, sạc nhanh 33W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 3990000},
            {"ram": "8GB", "rom": "256GB", "price": 4490000}
        ]
    },
    "Xiaomi Redmi A3": {
        "brand": "Xiaomi", "price": 1990000, "discount": 3,
        "specs": {
            "Màn hình": "6.71 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "8MP",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G36",
            "Pin": "5000 mAh, sạc 10W",
            "Hệ điều hành": "Android 14 Go, MIUI",
        },
        "memories": [
            {"ram": "3GB", "rom": "64GB", "price": 1990000},
            {"ram": "4GB", "rom": "128GB", "price": 2290000}
        ]
    },
    "Xiaomi Redmi A5": {
        "brand": "Xiaomi", "price": 2290000, "discount": 5,
        "specs": {
            "Màn hình": "6.74 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "13MP",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G81 Ultra",
            "Pin": "5160 mAh, sạc 18W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "4GB", "rom": "64GB", "price": 2290000},
            {"ram": "4GB", "rom": "128GB", "price": 2590000}
        ]
    },
    "Xiaomi Redmi Note 14 Pro": {
        "brand": "Xiaomi", "price": 7990000, "discount": 12,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "200MP OIS + 8MP Ultra Wide + 2MP Macro",
            "Camera trước": "20MP",
            "Chip": "MediaTek Helio G100 Ultra",
            "Pin": "5500 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 7990000},
            {"ram": "8GB", "rom": "256GB", "price": 8990000}
        ]
    },
    "Xiaomi Redmi Note 14 Pro 5G": {
        "brand": "Xiaomi", "price": 9490000, "discount": 10,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, 1.5K, 120Hz",
            "Camera sau": "200MP OIS + 8MP Ultra Wide + 2MP Macro",
            "Camera trước": "20MP",
            "Chip": "MediaTek Dimensity 7300 Ultra",
            "Pin": "5500 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 9490000},
            {"ram": "12GB", "rom": "512GB", "price": 11490000}
        ]
    },
    "Xiaomi Redmi Note 14 Pro+ 5G": {
        "brand": "Xiaomi", "price": 11990000, "discount": 8,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, 1.5K, 120Hz",
            "Camera sau": "200MP OIS + 50MP Telephoto 2.5x + 8MP Ultra Wide",
            "Camera trước": "20MP",
            "Chip": "Snapdragon 7s Gen 3",
            "Pin": "6200 mAh, sạc nhanh 90W",
            "Hệ điều hành": "Android 14, HyperOS",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 11990000},
            {"ram": "12GB", "rom": "512GB", "price": 13990000}
        ]
    },
    
    # ==================== OPPO (7 sản phẩm) ====================
    "OPPO A5": {
        "brand": "OPPO", "price": 2990000, "discount": 5,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Helio G85",
            "Pin": "5000 mAh, sạc 45W",
            "Hệ điều hành": "Android 14, ColorOS 14",
        },
        "memories": [
            {"ram": "4GB", "rom": "128GB", "price": 2990000},
            {"ram": "6GB", "rom": "128GB", "price": 3290000}
        ]
    },
    "OPPO A5 Pro": {
        "brand": "OPPO", "price": 4490000, "discount": 7,
        "specs": {
            "Màn hình": "6.7 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP + 8MP Ultra Wide + 2MP Macro",
            "Camera trước": "16MP",
            "Chip": "MediaTek Dimensity 7300",
            "Pin": "5000 mAh, sạc nhanh 80W",
            "Hệ điều hành": "Android 14, ColorOS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 4490000},
            {"ram": "12GB", "rom": "512GB", "price": 5490000}
        ]
    },
    "OPPO A5i Pro": {
        "brand": "OPPO", "price": 3790000, "discount": 5,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, ColorOS 14",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 3790000},
            {"ram": "8GB", "rom": "256GB", "price": 4290000}
        ]
    },
    "OPPO A60": {
        "brand": "OPPO", "price": 4990000, "discount": 8,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "Snapdragon 680",
            "Pin": "5000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, ColorOS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 4990000},
            {"ram": "8GB", "rom": "256GB", "price": 5490000}
        ]
    },
    "OPPO Find N3 Flip 5G": {
        "brand": "OPPO", "price": 22990000, "discount": 10,
        "specs": {
            "Màn hình": "6.8 inch AMOLED (gập), 3.26 inch (phụ), 120Hz",
            "Camera sau": "50MP OIS + 48MP Ultra Wide + 32MP Telephoto 2x",
            "Camera trước": "32MP",
            "Chip": "MediaTek Dimensity 9200",
            "Pin": "4300 mAh, sạc nhanh 44W",
            "Hệ điều hành": "Android 13, ColorOS 13.2",
        },
        "memories": [
            {"ram": "12GB", "rom": "256GB", "price": 22990000},
            {"ram": "12GB", "rom": "512GB", "price": 25990000}
        ]
    },
    "OPPO Find X8 Pro 5G": {
        "brand": "OPPO", "price": 32990000, "discount": 5,
        "specs": {
            "Màn hình": "6.78 inch, AMOLED LTPO, 1.5K, 120Hz",
            "Camera sau": "50MP OIS + 50MP Ultra Wide + 50MP Telephoto 3x + 50MP Periscope 6x",
            "Camera trước": "32MP",
            "Chip": "MediaTek Dimensity 9400",
            "Pin": "5910 mAh, sạc nhanh 80W",
            "Hệ điều hành": "Android 15, ColorOS 15",
        },
        "memories": [
            {"ram": "12GB", "rom": "256GB", "price": 32990000},
            {"ram": "16GB", "rom": "512GB", "price": 37990000}
        ]
    },
    "OPPO Reno14 F 5G": {
        "brand": "OPPO", "price": 8990000, "discount": 12,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 8MP Ultra Wide + 2MP Macro",
            "Camera trước": "32MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, ColorOS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 8990000},
            {"ram": "12GB", "rom": "512GB", "price": 10990000}
        ]
    },
    
    # ==================== VIVO (6 sản phẩm) ====================
    "vivo V30e": {
        "brand": "Vivo", "price": 8990000, "discount": 10,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 8MP Ultra Wide",
            "Camera trước": "50MP",
            "Chip": "Snapdragon 6 Gen 1",
            "Pin": "5500 mAh, sạc nhanh 44W",
            "Hệ điều hành": "Android 14, Funtouch OS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 8990000},
            {"ram": "12GB", "rom": "512GB", "price": 10990000}
        ]
    },
    "vivo V40 Lite": {
        "brand": "Vivo", "price": 7990000, "discount": 8,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 8MP Ultra Wide",
            "Camera trước": "32MP",
            "Chip": "Snapdragon 6 Gen 1",
            "Pin": "5000 mAh, sạc nhanh 44W",
            "Hệ điều hành": "Android 14, Funtouch OS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 7990000},
            {"ram": "8GB", "rom": "256GB", "price": 8990000}
        ]
    },
    "vivo V50 Lite": {
        "brand": "Vivo", "price": 6990000, "discount": 7,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "16MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh, sạc nhanh 44W",
            "Hệ điều hành": "Android 14, Funtouch OS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 6990000}
        ]
    },
    "vivo V60 5G": {
        "brand": "Vivo", "price": 11990000, "discount": 12,
        "specs": {
            "Màn hình": "6.78 inch, AMOLED, 1.5K, 120Hz",
            "Camera sau": "50MP OIS + 50MP Ultra Wide + 50MP Telephoto 2x",
            "Camera trước": "50MP",
            "Chip": "Snapdragon 7 Gen 3",
            "Pin": "5500 mAh, sạc nhanh 80W",
            "Hệ điều hành": "Android 15, Funtouch OS 15",
        },
        "memories": [
            {"ram": "12GB", "rom": "256GB", "price": 11990000},
            {"ram": "12GB", "rom": "512GB", "price": 13990000}
        ]
    },
    "vivo Y19s": {
        "brand": "Vivo", "price": 3990000, "discount": 5,
        "specs": {
            "Màn hình": "6.68 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "50MP + 0.08MP Flicker",
            "Camera trước": "5MP",
            "Chip": "Unisoc T612",
            "Pin": "5500 mAh, sạc 15W",
            "Hệ điều hành": "Android 14, Funtouch OS 14",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 3990000}
        ]
    },
    "vivo Y19s Pro": {
        "brand": "Vivo", "price": 4990000, "discount": 7,
        "specs": {
            "Màn hình": "6.68 inch, IPS LCD, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5500 mAh, sạc nhanh 44W",
            "Hệ điều hành": "Android 14, Funtouch OS 14",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 4990000},
            {"ram": "8GB", "rom": "256GB", "price": 5490000}
        ]
    },
    
    # ==================== REALME (6 sản phẩm) ====================
    "realme 14 5G": {
        "brand": "Realme", "price": 5990000, "discount": 10,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "16MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "6000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 15, Realme UI 6.0",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 5990000},
            {"ram": "8GB", "rom": "256GB", "price": 6490000}
        ]
    },
    "realme 14T 5G": {
        "brand": "Realme", "price": 7490000, "discount": 8,
        "specs": {
            "Màn hình": "6.67 inch, AMOLED, FHD+, 120Hz",
            "Camera sau": "50MP OIS + 8MP Ultra Wide + 2MP Macro",
            "Camera trước": "16MP",
            "Chip": "MediaTek Dimensity 7300",
            "Pin": "6000 mAh, sạc nhanh 67W",
            "Hệ điều hành": "Android 15, Realme UI 6.0",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 7490000},
            {"ram": "12GB", "rom": "512GB", "price": 8990000}
        ]
    },
    "realme C71": {
        "brand": "Realme", "price": 3990000, "discount": 5,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "Unisoc T612",
            "Pin": "5000 mAh, sạc 10W",
            "Hệ điều hành": "Android 14, Realme UI 5.0",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 3990000},
            {"ram": "8GB", "rom": "256GB", "price": 4490000}
        ]
    },
    "realme Note 60": {
        "brand": "Realme", "price": 2990000, "discount": 3,
        "specs": {
            "Màn hình": "6.74 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "32MP + 2MP Depth",
            "Camera trước": "5MP",
            "Chip": "Unisoc T612",
            "Pin": "5000 mAh, sạc 10W",
            "Hệ điều hành": "Android 14, Realme UI 5.0",
        },
        "memories": [
            {"ram": "4GB", "rom": "64GB", "price": 2490000},
            {"ram": "4GB", "rom": "128GB", "price": 2990000}
        ]
    },
    "realme Note 60x": {
        "brand": "Realme", "price": 3290000, "discount": 5,
        "specs": {
            "Màn hình": "6.74 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "32MP + 2MP Depth",
            "Camera trước": "5MP",
            "Chip": "Unisoc T612",
            "Pin": "5000 mAh, sạc 15W",
            "Hệ điều hành": "Android 14, Realme UI 5.0",
        },
        "memories": [
            {"ram": "6GB", "rom": "128GB", "price": 3290000},
            {"ram": "6GB", "rom": "256GB", "price": 3790000}
        ]
    },
    "realme Note 70": {
        "brand": "Realme", "price": 4490000, "discount": 7,
        "specs": {
            "Màn hình": "6.67 inch, IPS LCD, FHD+, 120Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "8MP",
            "Chip": "MediaTek Dimensity 6300",
            "Pin": "5000 mAh, sạc nhanh 45W",
            "Hệ điều hành": "Android 14, Realme UI 5.0",
        },
        "memories": [
            {"ram": "8GB", "rom": "128GB", "price": 4490000},
            {"ram": "8GB", "rom": "256GB", "price": 4990000}
        ]
    },
    
    # ==================== HONOR (4 sản phẩm) ====================
    "HONOR 400 Lite": {
        "brand": "HONOR", "price": 3490000, "discount": 5,
        "specs": {
            "Màn hình": "6.8 inch, IPS LCD, FHD+, 90Hz",
            "Camera sau": "108MP + 2MP Depth",
            "Camera trước": "16MP",
            "Chip": "MediaTek Dimensity 6080",
            "Pin": "6000 mAh, sạc nhanh 35W",
            "Hệ điều hành": "Android 14, MagicOS 8.0",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 3490000},
            {"ram": "8GB", "rom": "512GB", "price": 4490000}
        ]
    },
    "HONOR X5b Plus": {
        "brand": "HONOR", "price": 2490000, "discount": 3,
        "specs": {
            "Màn hình": "6.56 inch, IPS LCD, HD+, 90Hz",
            "Camera sau": "50MP",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G85",
            "Pin": "5200 mAh, sạc 10W",
            "Hệ điều hành": "Android 14, MagicOS 8.0",
        },
        "memories": [
            {"ram": "4GB", "rom": "64GB", "price": 2190000},
            {"ram": "4GB", "rom": "128GB", "price": 2490000}
        ]
    },
    "HONOR X6c": {
        "brand": "HONOR", "price": 2990000, "discount": 5,
        "specs": {
            "Màn hình": "6.77 inch, TFT LCD, HD+, 90Hz",
            "Camera sau": "50MP + 2MP Depth",
            "Camera trước": "5MP",
            "Chip": "MediaTek Helio G85",
            "Pin": "5200 mAh, sạc 10W",
            "Hệ điều hành": "Android 14, MagicOS 8.0",
        },
        "memories": [
            {"ram": "4GB", "rom": "128GB", "price": 2990000},
            {"ram": "6GB", "rom": "256GB", "price": 3490000}
        ]
    },
    "HONOR X8c": {
        "brand": "HONOR", "price": 4990000, "discount": 8,
        "specs": {
            "Màn hình": "6.7 inch, AMOLED, FHD+, 90Hz",
            "Camera sau": "108MP + 5MP Ultra Wide + 2MP Macro",
            "Camera trước": "16MP",
            "Chip": "Snapdragon 4 Gen 2",
            "Pin": "4500 mAh, sạc nhanh 35W",
            "Hệ điều hành": "Android 14, MagicOS 8.0",
        },
        "memories": [
            {"ram": "8GB", "rom": "256GB", "price": 4990000},
            {"ram": "8GB", "rom": "512GB", "price": 5990000}
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
    import re
    text = text.lower()
    # Xử lý ký tự đặc biệt + -> -plus
    text = text.replace('+', '-plus')
    text = re.sub(r'[^\w\s-]', '', text)
    text = text.replace(" ", "-")
    # Remove duplicate hyphens
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

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
            print(f"   ⚠️  Chưa có thông tin cho: {folder_name} -> {product_name}")
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
            "description": f"{product_name} - Điện thoại chính hãng, giá tốt",
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

def generate_complete_seed_data():
    """Generate seed data cho TẤT CẢ 7 thương hiệu"""
    print("🔍 BẮT ĐẦU QUÉT TOÀN BỘ SẢN PHẨM...")
    print("=" * 60)
    
    all_products = []
    brands_to_scan = ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "HONOR"]
    
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
            {"name": "Xanh nhạt", "code": "#87CEEB"},
            {"name": "Đỏ", "code": "#FF0000"},
            {"name": "Vàng Kim", "code": "#DAA520"},
            {"name": "Xanh Titan", "code": "#778899"},
            {"name": "Nâu", "code": "#8B4513"},
            {"name": "Xanh đậm", "code": "#003366"},
            {"name": "Xanh Đậm", "code": "#004080"}
        ],
        "memories": [
            {"ram": "3GB", "rom": "32GB", "chipset": None},
            {"ram": "3GB", "rom": "64GB", "chipset": None},
            {"ram": "4GB", "rom": "64GB", "chipset": None},
            {"ram": "4GB", "rom": "128GB", "chipset": None},
            {"ram": "4GB", "rom": "256GB", "chipset": None},
            {"ram": "6GB", "rom": "128GB", "chipset": None},
            {"ram": "6GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "128GB", "chipset": None},
            {"ram": "8GB", "rom": "256GB", "chipset": None},
            {"ram": "8GB", "rom": "512GB", "chipset": None},
            {"ram": "8GB", "rom": "1TB", "chipset": None},
            {"ram": "12GB", "rom": "256GB", "chipset": None},
            {"ram": "12GB", "rom": "512GB", "chipset": None},
            {"ram": "12GB", "rom": "1TB", "chipset": None},
            {"ram": "16GB", "rom": "512GB", "chipset": None}
        ],
        "products": all_products
    }
    
    # Lưu ra file
    output_file = "seed_data_complete.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(seed_data, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print(f"✅ ĐÃ TẠO FILE: {output_file}")
    print(f"📦 TỔNG SỐ SẢN PHẨM: {len(all_products)}")
    print("\n📊 CHI TIẾT THEO THƯƠNG HIỆU:")
    
    for brand in brands_to_scan:
        count = len([p for p in all_products if p["brand"] == brand])
        if count > 0:
            print(f"   • {brand}: {count} sản phẩm")
    
    print("=" * 60)

if __name__ == "__main__":
    generate_complete_seed_data()
