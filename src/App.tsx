import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Calculator from "./components/Calculator";


function App(){
  return(
    
     <div style={{ minHeight: '100vh', background: '#F5F3EE' }}>
     <Navbar />
     <Hero />
     <Calculator />
     <Footer />
     </div>
  )

  

}

export default App;