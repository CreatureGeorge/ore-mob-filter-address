import NavBar from './Navbar'

export default function Layout({children}) {
  return (
    <>
      <main className="w-full ">{children}</main>
    </>
  )
}