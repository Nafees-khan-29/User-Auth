import React from 'react'
import Navbar from '../component/Navbar'
import Header from '../component/Header'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <Header/>
      </main>
    </div>
  )
}

export default Home
