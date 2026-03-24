"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Users, ArrowRight, BadgeCheck, Briefcase, Star, Quote } from 'lucide-react';

const teamMembers = [
  {
    name: "William Thompson",
    role: "Founder & CEO",
    exp: "12+ Yrs Exp",
    desc: "Visionary leader driving the company's global expansion.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=500&auto=format&fit=crop", 
    socials: { fb: "#", tw: "#", li: "#" }
  },
  {
    name: "Amuana Joey",
    role: "Marketing Leader",
    exp: "8+ Yrs Exp",
    desc: "Expert in digital strategy and global brand positioning.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop",
    socials: { fb: "#", ig: "#", li: "#" }
  },
  {
    name: "Albert Henry",
    role: "Co-Ordinator",
    exp: "5+ Yrs Exp",
    desc: "Master of internal operations and team efficiency.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&auto=format&fit=crop",
    socials: { tw: "#", li: "#", ig: "#" }
  },
];

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function OurTeam() {
  return (
    <section className="relative w-full py-24 px-6 lg:px-12 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-[20%] w-96 h-96 bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-80 h-80 bg-green-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-xl flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase shadow-sm w-fit">
              <Users size={14} />
              /003 Our Team
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mt-2">
              Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">expert team.</span>
            </h2>
          </div>
          
          <div className="max-w-md">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium mb-6 md:mb-0">
              Take the hassle out of communication written templates and tight 
              integrations with the management tools you use.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-500 dark:hover:bg-green-500 hover:text-white dark:hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            Join Our Team
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Team Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants} className="group cursor-pointer flex flex-col items-center w-full max-w-[360px]">
              
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-5 w-full transition-all duration-500 hover:shadow-2xl hover:border-green-500/30 dark:hover:border-green-500/30 relative overflow-hidden hover:-translate-y-2">
                 
                {/* Background Glow inside Card */}
                <div className="absolute -inset-2 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image Container */}
                <div className="relative w-full h-64 overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-950 mb-7 shadow-inner">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                  />
                  
                  {/* Floating Exp Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 border border-white/20 dark:border-zinc-700">
                      <Star size={12} className="text-green-500 fill-green-500" />
                      <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest">{member.exp}</span>
                  </div>

                  {/* Overlay with Social Icons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                      {member.socials.fb && <SocialIcon Icon={Facebook} link={member.socials.fb} />}
                      {member.socials.tw && <SocialIcon Icon={Twitter} link={member.socials.tw} />}
                      {member.socials.li && <SocialIcon Icon={Linkedin} link={member.socials.li} />}
                      {member.socials.ig && <SocialIcon Icon={Instagram} link={member.socials.ig} />}
                  </div>
                </div>
                
                {/* Info Text */}
                <div className="space-y-4 text-center px-3 relative z-10">
                  <div className="space-y-1.5">
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors flex items-center justify-center gap-1.5">
                        {member.name}
                        <BadgeCheck className="text-blue-500 size-[18px]" />
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500 text-xs font-bold uppercase tracking-widest">
                        <Briefcase size={12} />
                        {member.role}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed flex items-start justify-center gap-2">
                        <Quote size={14} className="mt-0.5 text-zinc-300 dark:text-zinc-700 flex-shrink-0" />
                        <span className="italic">{member.desc}</span>
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Reusable Social Icon Component
interface SocialIconProps {
  Icon: React.ElementType;
  link: string;
}

function SocialIcon({ Icon, link }: SocialIconProps) {
    return (
        <motion.a 
            href={link}
            whileHover={{ scale: 1.1, y: -5 }}
            className="w-10 h-10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-colors shadow-lg"
        >
            <Icon size={18} />
        </motion.a>
    );
}