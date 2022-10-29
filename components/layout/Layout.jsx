import NavBar from './Navbar'

export default function Layout({children}) {
  return (
    <>
      <NavBar />
      <main className="w-full ">{children}</main>
    </>
  )
}