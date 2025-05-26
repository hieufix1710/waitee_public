export default function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Waitee: Xây dựng & Quản lý cửa hàng trực tuyến của bạn</h1>
        <p className="text-lg text-gray-700">
          Khởi tạo cửa hàng trực tuyến chỉ trong vài phút. Quản lý sản phẩm, đơn hàng và khách hàng thông minh & nhanh chóng với Waitee.
        </p>
      </header>
      <section className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-8">
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span>
              <strong>Thiết lập dễ dàng:</strong> Không cần biết lập trình, bắt đầu ngay lập tức.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span>
              <strong>Quản lý thông minh:</strong> Theo dõi tồn kho, đơn hàng và khách hàng trên một bảng điều khiển.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span>
              <strong>Thân thiện di động:</strong> Quản lý cửa hàng mọi lúc, mọi nơi.
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span>
              <strong>Phân tích & Thống kê:</strong> Ra quyết định thông minh hơn với dữ liệu thời gian thực.
            </span>
          </li>
        </ul>
      </section>
      <a
        href="#"
        className="w-full max-w-md bg-blue-600 text-white text-center py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
      >
        Bắt đầu miễn phí
      </a>
      <footer className="mt-8 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Waitee. Đã đăng ký bản quyền.
      </footer>
    </div>
    </>
  );
}
