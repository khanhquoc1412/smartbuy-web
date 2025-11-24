/**
 * Script test UserService API
 * Chạy: node test-userservice.js
 */

const http = require("http");

const testHealthCheck = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3005,
      path: "/health",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log("✅ UserService đang chạy:");
          console.log(JSON.parse(data));
          resolve(true);
        } else {
          console.log("❌ UserService trả về lỗi:", res.statusCode);
          reject(false);
        }
      });
    });

    req.on("error", (error) => {
      console.log("❌ Không thể kết nối UserService trên port 3005");
      console.log("   Lỗi:", error.message);
      console.log("\n💡 Hãy chạy: cd server/userservice && npm run dev");
      reject(false);
    });

    req.end();
  });
};

const testLogin = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: "user1@smartbuy.com",
      password: "user12345",
    });

    const options = {
      hostname: "localhost",
      port: 3005,
      path: "/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log("\n✅ Đăng nhập thành công!");
          console.log("   User:", response.data?.user?.email);
          console.log(
            "   Token:",
            response.data?.token?.substring(0, 50) + "..."
          );
          resolve(response.data.token);
        } else {
          console.log("\n❌ Đăng nhập thất bại:", res.statusCode);
          console.log("   Response:", data);
          console.log("\n💡 Hãy chạy: cd server/userservice && npm run seed");
          reject(false);
        }
      });
    });

    req.on("error", (error) => {
      console.log("❌ Lỗi kết nối:", error.message);
      reject(false);
    });

    req.write(postData);
    req.end();
  });
};

const testGetDefaultAddress = (token) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3005,
      path: "/api/user/addresses/default",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log("\n✅ Lấy địa chỉ mặc định thành công!");
          if (response.data?.address) {
            const addr = response.data.address;
            console.log("   Tên:", addr.fullName);
            console.log("   SĐT:", addr.phone);
            console.log(
              "   Địa chỉ:",
              `${addr.address}, ${addr.ward}, ${addr.district}, ${addr.province}`
            );
            console.log("   Mặc định:", addr.isDefault);
          } else {
            console.log("   ⚠️  Chưa có địa chỉ mặc định");
            console.log(
              "   💡 Hãy chạy: cd server/userservice && node seed-address.js"
            );
          }
          resolve(true);
        } else {
          console.log("\n❌ Lấy địa chỉ thất bại:", res.statusCode);
          console.log("   Response:", data);
          reject(false);
        }
      });
    });

    req.on("error", (error) => {
      console.log("❌ Lỗi:", error.message);
      reject(false);
    });

    req.end();
  });
};

// Chạy test
console.log("🔍 Đang kiểm tra UserService...\n");
testHealthCheck()
  .then(() => testLogin())
  .then((token) => testGetDefaultAddress(token))
  .then(() => {
    console.log("\n✅ TẤT CẢ TEST PASS!");
    console.log("\n📌 Bước tiếp theo:");
    console.log("   1. Chạy frontend: cd client && npm run dev");
    console.log("   2. Đăng nhập bằng: user1@smartbuy.com / user12345");
    console.log("   3. Vào trang checkout để xem địa chỉ tự động điền");
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
