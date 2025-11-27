<template>
  <div class="policy-page tw-pb-8">
    <BreadScrumb
      name-page="Chính sách"
      :sub-navs="[]"
    />
    <Container class="tw-mt-4">
      <div class="tw-bg-white tw-rounded-lg tw-p-6 tw-shadow-sm">
        <Heading title="CHÍNH SÁCH CỬA HÀNG" class="tw-mb-6 tw-text-center" />
        
        <div class="policy-content tw-flex tw-flex-col tw-gap-8">
          <!-- Chính sách bảo hành -->
          <section>
            <h3 class="tw-text-xl tw-font-bold tw-text-red-600 tw-mb-3">1. Chính sách bảo hành</h3>
            <ul class="tw-list-disc tw-pl-5 tw-space-y-2 tw-text-gray-700">
              <li>Bảo hành chính hãng 12 tháng đối với tất cả các sản phẩm điện thoại, máy tính bảng, laptop.</li>
              <li>Bảo hành 6 tháng đối với phụ kiện (cáp, sạc, tai nghe...).</li>
              <li>Đổi mới trong vòng 30 ngày đầu nếu có lỗi từ nhà sản xuất.</li>
              <li>Điều kiện bảo hành: Sản phẩm còn nguyên tem, không bị rơi vỡ, vào nước hoặc can thiệp phần cứng trái phép.</li>
            </ul>
          </section>

          <!-- Chính sách đổi trả -->
          <section>
            <h3 class="tw-text-xl tw-font-bold tw-text-red-600 tw-mb-3">2. Chính sách đổi trả</h3>
            <ul class="tw-list-disc tw-pl-5 tw-space-y-2 tw-text-gray-700">
              <li>Khách hàng được quyền đổi trả sản phẩm trong vòng 7 ngày nếu không ưng ý (sản phẩm phải còn nguyên seal, chưa kích hoạt).</li>
              <li>Hoàn tiền 100% nếu sản phẩm nhận được không đúng với mô tả hoặc bị lỗi do vận chuyển.</li>
              <li>Quy trình đổi trả: Liên hệ hotline 1900.9999 hoặc mang trực tiếp đến cửa hàng gần nhất.</li>
            </ul>
          </section>

          <!-- Chính sách vận chuyển -->
          <section>
            <h3 class="tw-text-xl tw-font-bold tw-text-red-600 tw-mb-3">3. Chính sách vận chuyển</h3>
            <ul class="tw-list-disc tw-pl-5 tw-space-y-2 tw-text-gray-700">
              <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên trong nội thành.</li>
              <li>Giao hàng hỏa tốc trong 2 giờ đối với khu vực nội thành.</li>
              <li>Thời gian giao hàng các tỉnh thành khác: 2-4 ngày làm việc.</li>
              <li>Kiểm tra hàng trước khi thanh toán (COD).</li>
            </ul>
          </section>

          <!-- Chính sách bảo mật -->
          <section>
            <h3 class="tw-text-xl tw-font-bold tw-text-red-600 tw-mb-3">4. Chính sách bảo mật thông tin</h3>
            <p class="tw-text-gray-700">
              SmartBuy cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Thông tin của quý khách chỉ được sử dụng cho mục đích xử lý đơn hàng và chăm sóc khách hàng, tuyệt đối không chia sẻ với bên thứ ba.
            </p>
          </section>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import Container from "@/components/base/Container.vue";
import Heading from "@/components/base/Heading.vue";
</script>

<route lang="yaml">
name: "Chính sách"
meta:
  layout: "default"
</route>

<style scoped lang="scss">
.policy-content {
  h3 {
    color: $red; // Sử dụng biến màu global nếu có, hoặc fallback
  }
}
</style>
