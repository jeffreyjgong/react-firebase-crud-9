import React from 'react'
import Banner from '../components/Banner/Banner'
import Header from '../components/Header'
import PatientsTable from '../components/PatientTable'

const Homepage = () => {
   return(
      <>
         <Header />
         <Banner />
         <PatientsTable />
      </>
   )
}

export default Homepage