export default function PhoneFrame({ children }) {
  return (
    <div className="phone-outer">
      <div className="phone-frame">
        <div className="screen-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}
