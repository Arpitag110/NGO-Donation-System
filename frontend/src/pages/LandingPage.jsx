import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
            <div className="max-w-2xl text-center">
                {/* Heading */}
                <h1 className="text-6xl md:text-7xl font-bold mb-6">
                    <span className="text-red-600">My</span>NGO
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed">
                    Making a difference, one donation at a time. Join us in our mission to
                    create positive change in communities. Together, we can build a better future
                    for those in need.
                </p>

                {/* Donate Now Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold 
                     text-lg hover:bg-red-700 transition duration-200 shadow-lg"
                >
                    Donate Now
                </button>

                {/* Additional Info */}
                <div className="mt-12 text-zinc-400 text-sm">
                    <p>Start making an impact today</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
