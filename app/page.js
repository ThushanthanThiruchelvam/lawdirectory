// app/page.js
'use client';
import HeroSection from "@/Components/HeroSection";
import AboutSection from "@/Components/AboutSection";
import ServicesSection from "@/Components/ServicesSection";
import BlogList from "@/Components/BlogList";
import ContactForm from "@/Components/ContactForm";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import LawyersSection from "@/Components/LawyersSection"; // Add this import
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <ToastContainer theme="dark"/>
      <Header/>
      <HeroSection/>
      <LawyersSection/> {/* Add Lawyers Section */}
            <AboutSection/>
      <ServicesSection/>
      <BlogList/>
      <ContactForm/>
      <Footer/>
    </>
  );
}