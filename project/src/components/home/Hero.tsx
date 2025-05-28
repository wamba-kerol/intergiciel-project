import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden">
      {/* Formes abstraites en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-700 rounded-full opacity-20"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-blue-700 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-700 rounded-full opacity-20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col md:flex-row items-center">
        {/* Contenu texte */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 text-center md:text-left mb-12 md:mb-0"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Système Intégré de Gestion<br/>
            <span className="text-yellow-300">pour Institutions Éducatives</span>
          </h1>
          <p className="text-xl text-blue-50 mb-8 max-w-lg mx-auto md:mx-0">
            Notre plateforme offre une solution complète pour la gestion des enseignements et des ressources bibliothécaires de votre institut.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/login/education" 
                className="px-8 py-4 bg-yellow-500 text-blue-900 font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300 inline-block"
              >
                Gestion des Enseignements
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/login/library" 
                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 inline-block"
              >
                Gestion de Bibliothèque
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Image du campus de l'université de Dschang */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="md:w-1/2"
        >
          <img 
            src="https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"  // Remplacez ce lien par celui de l'image du campus
            alt="Campus de l'Université de Dschang" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </motion.div>
      </div>
      
      {/* Indicateur de défilement */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
