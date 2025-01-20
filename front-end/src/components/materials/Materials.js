import React, { useState, useEffect } from "react";
import "./Materials.css";
import NavBar from "../NavBar/NavBar";

function Materials() {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        fetch('http://51.107.7.88:3001/material')
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setMaterials(data);
                    });
                }
            });
    }, []);

    const extractImageFromLink = (link) => {
        if (link.includes("youtube.com")) {
            const videoId = link.split("v=")[1];
            return `https://img.youtube.com/vi/${videoId}/0.jpg`;
        }
        // Fallback for other links
        return "https://via.placeholder.com/300"; // Placeholder image if no preview is available
    };

    return (
        <div>
            <NavBar />

            <div className="materials-main-container">
                {materials.map((material) => (
                    <a
                        href={material.link}
                        className="material-card"
                        key={material._id}
                        style={{
                            backgroundImage: `url(${extractImageFromLink(material.link)})`,
                        }}
                    >
                        <div className="material-overlay">{material.name}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Materials;
