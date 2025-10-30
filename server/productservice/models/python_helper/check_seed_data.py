import json

# Đọc file seed data
with open('seed_data_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Lấy danh sách màu đã định nghĩa
defined_colors = set(c['name'] for c in data['colors'])

# Kiểm tra màu trong products
print("🔍 KIỂM TRA MÀU SẮC KHÔNG KHỚP:\n")
print(f"Đã định nghĩa {len(defined_colors)} màu:")
for color in sorted(defined_colors):
    print(f"  ✅ {color}")

print("\n" + "="*60)
print("\n📱 KIỂM TRA TỪNG SẢN PHẨM:\n")

errors = []
for product in data['products']:
    product_colors = set()
    
    # Thu thập màu từ variants
    for variant in product.get('variants', []):
        product_colors.add(variant['color'])
    
    # Thu thập màu từ images
    for image in product.get('images', []):
        product_colors.add(image['color'])
    
    # Kiểm tra màu không tồn tại
    missing_colors = product_colors - defined_colors
    if missing_colors:
        errors.append({
            'product': product['name'],
            'brand': product['brand'],
            'missing_colors': list(missing_colors),
            'defined_colors': list(product_colors & defined_colors)
        })
        print(f"❌ {product['name']} ({product['brand']})")
        for color in missing_colors:
            print(f"   ⚠️  Màu không tồn tại: '{color}'")

if errors:
    print(f"\n{'='*60}")
    print(f"\n⚠️  Tổng cộng {len(errors)} sản phẩm có màu không khớp")
    
    # Gợi ý màu cần thêm
    all_missing = set()
    for err in errors:
        all_missing.update(err['missing_colors'])
    
    print(f"\n📝 CÁC MÀU CẦN THÊM VÀO FILE JSON:")
    for color in sorted(all_missing):
        print(f'   {{ "name": "{color}", "code": "#XXXXXX" }},')
else:
    print("\n✅ TẤT CẢ MÀU ĐỀU KHỚP!")

# Kiểm tra memories
print("\n" + "="*60)
print("\n🔍 KIỂM TRA MEMORY KHÔNG KHỚP:\n")

defined_memories = set(f"{m['ram']}/{m['rom']}" for m in data['memories'])
print(f"Đã định nghĩa {len(defined_memories)} memory:")
for mem in sorted(defined_memories):
    print(f"  ✅ {mem}")

print("\n📱 KIỂM TRA MEMORY TRONG PRODUCTS:\n")

memory_errors = []
for product in data['products']:
    product_memories = set()
    
    for variant in product.get('variants', []):
        mem = variant['memory']
        mem_key = f"{mem['ram']}/{mem['rom']}"
        product_memories.add(mem_key)
    
    missing_memories = product_memories - defined_memories
    if missing_memories:
        memory_errors.append({
            'product': product['name'],
            'brand': product['brand'],
            'missing_memories': list(missing_memories)
        })
        print(f"❌ {product['name']} ({product['brand']})")
        for mem in missing_memories:
            print(f"   ⚠️  Memory không tồn tại: '{mem}'")

if memory_errors:
    print(f"\n{'='*60}")
    print(f"\n⚠️  Tổng cộng {len(memory_errors)} sản phẩm có memory không khớp")
    
    all_missing_mem = set()
    for err in memory_errors:
        all_missing_mem.update(err['missing_memories'])
    
    print(f"\n📝 CÁC MEMORY CẦN THÊM VÀO FILE JSON:")
    for mem in sorted(all_missing_mem):
        ram, rom = mem.split('/')
        print(f'   {{ "ram": "{ram}", "rom": "{rom}", "chipset": null }},')
else:
    print("\n✅ TẤT CẢ MEMORY ĐỀU KHỚP!")

# Kiểm tra duplicate slugs
print("\n" + "="*60)
print("\n🔍 KIỂM TRA DUPLICATE SLUGS:\n")

slugs = {}
for product in data['products']:
    slug = product['slug']
    if slug in slugs:
        print(f"❌ Duplicate slug: '{slug}'")
        print(f"   - {slugs[slug]}")
        print(f"   - {product['name']}")
    else:
        slugs[slug] = product['name']

print(f"\n✅ Tổng {len(slugs)} slugs unique")
