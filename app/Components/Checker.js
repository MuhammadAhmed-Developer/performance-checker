"use client"
import React, { useState } from "react";

export default function Checker() {
  const [websiteLink, setWebsiteLink] = useState("");
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPerformanceStyle = (percentage) => {
    let bgColor, borderColor, textColor;

    if (percentage >= 0 && percentage < 50) {
      bgColor = "red"; // Light Red for 0-49%
      borderColor = "darkred";
      textColor = "white";
    } else if (percentage >= 50 && percentage < 80) {
      bgColor = "yellow"; // Yellow for 50-79%
      borderColor = "darkorange";
      textColor = "black";
    } else {
      bgColor = "green"; // Green for 80-100%
      borderColor = "forestgreen";
      textColor = "white";
    }

    return { backgroundColor: bgColor, borderColor, color: textColor };
  };

  const handleSubmit = async () => {
    if (!websiteLink) {
      alert("Link is Required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${websiteLink}&key=AIzaSyCCLJbFPkdNZOCajAMroS9fp8_vm65uQFc`
      );

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        console.log("data", data);
        console.log("performace=====", data.lighthouseResult.categories.performance.score * 100);
        console.log("Seo=====", data.lighthouseResult.categories.seo);
        console.log("Light house=====", data.lighthouseResult);
        setPerformanceData(data);
      } else {
        console.error("Error fetching performance data");
        alert("Add valid URL")
        setPerformanceData(null);
        setLoading(false);
        return
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setPerformanceData(null);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen  justify-center md:p-3 p-3  lg:p-20">
      <div>
        <h3 className=" text-orange-500 text-2xl font-bold mb-2">
          Report from Nov 7, 2023, 10:37:11 PM
        </h3>
        <div className="my-[3vh] flex gap-5">
          <input
            required
            className="shadow  border rounded-[12px] text-xl lg:w-[100vh] md:w-[100%] w-[100%] py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="https://example.com"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
          />
          <div className="text-center"></div>
          <button
          disabled={loading}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold  px-[32px] rounded-lg focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Analyze
          </button>
        </div>

        {loading ? (
          <div className=" justify-center">
            <div className="flex justify-center">
              <div class="spin">
                <div class="inner"></div>
              </div>
            </div>
            <div className="text-center mt-1 text-orange-500">Analyzing...</div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="performance-details">
              {performanceData && (
                <>
                  <div
                    className="p-5 w-[20vh] h-[20vh] mt-9 flex justify-center items-center rounded-full text-white text-2xl font-bold"
                    style={getPerformanceStyle(
                      performanceData.lighthouseResult.categories.performance.score * 100
                    )}
                  >
                    {performanceData.lighthouseResult.categories.performance.score * 100} %
                  </div>
                  <div className="text-white text-sm ml-5">Performance</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-[30vh] text-center text-sm">
        🟥 0 - 49% &nbsp;&nbsp;&nbsp;&nbsp; 🟨 50 - 79% &nbsp;&nbsp;&nbsp;&nbsp;🟩 80 - 100%
      </div>
    </div>
  );
}
