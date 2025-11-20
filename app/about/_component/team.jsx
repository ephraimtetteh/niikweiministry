"use client";
import { useState } from "react";
import Image from "next/image";
import { teamMembers } from "@/constants/team";


const TeamSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="lg:px-28 px-6 lg:text-center my-16">
      <h2 className="text-3xl font-bold mb-8 relative pb-1" data-aos="fade-up">
        Meet Our Team
        <span className="absolute left-0 lg:left-1/2 bottom-0 w-[10%] h-1 rounded-full bg-violet-500"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-lg lg:shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105"
            data-aos="zoom-in"
          >
            <Image
              src={member.imageUrl}
              alt="team member"
              width={300}
              height={300}
              className="w-full h-[300px] object-fill"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600 font-semibold">{member.title}</p>
              <p className="text-gray-500 text-[14px] mt-2">{member.shortDescription}</p>
              <button
                className="text-violet-500 font-medium mt-2 hover:underline"
                onClick={() => openModal(member)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-6xl shadow-lg relative overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white font-bold hover:text-gray-800 z-100 bg-purple-500 rounded-full p-4"
            >
              ✕
            </button>
            <div className="flex gap-4 lg:gap-10 flex-col lg:flex-row">
              <Image
                src={selectedMember.imageUrl}
                alt={selectedMember.name}
                width={300}
                height={300}
                className="lg:w-[40%] w-full rounded-md mb-4 lg:sticky"
              />
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                <p className="text-gray-600 mb-2">{selectedMember.title}</p>
                <p className="text-left">{selectedMember.fullDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
