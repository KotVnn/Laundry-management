// components/ReceiptPrint.tsx
'use client'
import { useRef } from 'react'
import { useAppContext } from '@/context/app-context';
import { IOrder } from '@/interfaces/order.interface';
import { formatVND } from '@/lib/utils';

export default function Receipt({ order }: { order: IOrder }) {
  const { config } = useAppContext();

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML
    const win = window.open('', '', 'width=300,height=600')
    if (win && printContent) {
      win.document.write(`
        <html>
          <head>
            <title>Hóa đơn</title>
            <style>
              body { background: transparent; margin: 0; font-family: sans-serif; font-size: 12px; }
              .print-container { width: 100%; padding: 10px 0; font-weight: 700; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 5px; }
              hr { margin: 10px 0; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `)
      win.document.close()
    }
  }

  return (
    <>
      <div ref={printRef}>
        {/* ĐÂY LÀ HTML hóa đơn đã render (viết tay hoặc convert từ pug) */}
        <div className="print-container">
          <h1 style={{ textAlign: 'center', margin: 0 }}>{config.title.toUpperCase()}</h1>
          <small style={{ fontSize: '16px', textAlign: 'center', display: 'block' }}>{config.address}</small>
          <small style={{ textAlign: 'center', display: 'block' }}>SĐT: {config.phone}</small>
          <p style={{ textAlign: 'center', margin: 0 }}>***</p>
          <h5>MÃ HÓA ĐƠN: #{order.id}</h5>
          <small>{new Date().toLocaleString()}</small>
          <br />
          <small>Khách hàng: {order.customer?.fullName || 'khách lẻ'}</small><br />
          <small>Địa chỉ: {order.customer?.address || ''}</small><br />
          <small>SĐT: {order.customer?.phone || ''}</small>
          <table>
            <thead>
            <tr>
              <td>Số lượng</td>
              <td style={{ textAlign: 'right' }}>Thành tiền</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>{order.quantity}</td>
              <td style={{ textAlign: 'right' }}>{formatVND(order.total)}</td>
            </tr>
            <tr>
              <td>Giảm giá</td>
              <td style={{ textAlign: 'right' }}>{formatVND(order.discount * 1000)}</td>
            </tr>
            <tr>
              <td>Tích điểm</td>
              <td style={{ textAlign: 'right' }}>{order.point}</td>
            </tr>
            </tbody>
          </table>
          <hr />
          <center>
            <small>Bảo quản nơi khô thoáng.</small><br />
            <small>Cảm ơn quý khách.</small><br />
            <small>***</small><br />
            <img
              src={`https://api.vietqr.io/image/970407-MS00T01255128491664-EILMZ0Z.jpg?amount=${order.total}&addInfo=${order.id}`}
              style={{ width: '90%' }}
              alt="QR code"
            />
          </center>
        </div>
      </div>
      <button onClick={handlePrint}>🖨️ In hóa đơn</button>
    </>
  )
}
