import Image from "next/image";

export default function Home() {
  return (
    <div className="h-svh">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#fc6464]/10 to-white px-4 py-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#fc6464] mb-4">
            Waitee: Xây dựng & Quản lý cửa hàng trực tuyến của bạn
          </h1>
          <p className="text-lg text-gray-700">
            Khởi tạo cửa hàng trực tuyến chỉ trong vài phút. Quản lý sản phẩm,
            đơn hàng và khách hàng thông minh & nhanh chóng với Waitee.
          </p>
        </header>

        {/* Mobile frames section */}
        <div className="flex gap-6 mb-8 flex-col lg:flex-row w-full justify-center items-center relative">
          <Image
            src="/assets/frame1.png"
            alt="frame1"
            width={300}
            height={500}
            className="rounded-[3rem] shadow-lg"
          />
          <Image
            src="/assets/frame2.png"
            alt="frame2"
            width={300}
            height={500}
            className="rounded-[3rem] shadow-lg"
          />
          <div className="flex-row absolute left-24 top-16 bg-white rounded-xl shadow-md p-3 items-center gap-3  hidden lg:flex">
            <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <strong>Thiết lập dễ dàng:</strong> Bắt đầu ngay lập tức.
            </span>
          </div>
          <div className="flex-row absolute left-10 top-30 bg-white rounded-xl shadow-md p-3 items-center gap-3  hidden lg:flex max-w-96">
            <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <strong>Quản lý thông minh:</strong> Theo dõi tồn kho, đơn hàng và
              khách hàng trên một bảng điều khiển.
            </span>
          </div>
          <div className="flex-row absolute right-16 top-48 bg-white rounded-xl shadow-md p-3 items-center gap-3  hidden lg:flex max-w-96">
            <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <strong>Thân thiện di động:</strong> Quản lý cửa hàng mọi lúc, mọi
              nơi.
            </span>
          </div>
          <div className="flex-row absolute right-24 top-96 bg-white rounded-xl shadow-md p-3 items-center gap-3  hidden lg:flex max-w-96">
            <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <strong>Phân tích & Thống kê:</strong> Ra quyết định thông minh
              hơn với dữ liệu thời gian thực.
            </span>
          </div>
        </div>

        <section className="block lg:hidden w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-8">
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <strong>Thiết lập dễ dàng:</strong> Bắt đầu ngay lập tức.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <strong>Quản lý thông minh:</strong> Theo dõi tồn kho, đơn hàng
                và khách hàng trên một bảng điều khiển.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <strong>Thân thiện di động:</strong> Quản lý cửa hàng mọi lúc,
                mọi nơi.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-[#fc6464]/20 text-[#fc6464] rounded-full p-2 mr-3">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <strong>Phân tích & Thống kê:</strong> Ra quyết định thông minh
                hơn với dữ liệu thời gian thực.
              </span>
            </li>
          </ul>
        </section>

        <a
          href="https://m.me/553491717858025"
          className="w-full max-w-md bg-[#fc6464] text-white text-center py-3 rounded-lg font-semibold shadow hover:bg-[#e05555] transition"
        >
          Liên hệ với chúng tôi
        </a>
        <footer className="mt-8 text-gray-400 text-xs text-center">
          &copy; {new Date().getFullYear()} Waitee. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
