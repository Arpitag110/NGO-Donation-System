import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex items-center justify-center px-4 py-20">
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

            {/* Why Donate Section */}
            <section className="bg-zinc-800 px-6 py-16 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                        Why Donate?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 text-center hover:border-red-600 transition">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Direct Impact
                            </h3>
                            <p className="text-zinc-400">
                                Your donations directly help communities in need. Every rupee counts and makes a real difference in people's lives.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 text-center hover:border-red-600 transition">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Transparent Tracking
                            </h3>
                            <p className="text-zinc-400">
                                Track your donations in real-time. View detailed reports and see exactly how your contributions are being utilized.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 text-center hover:border-red-600 transition">
                            <div className="text-4xl mb-4">❤️</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Make a Difference
                            </h3>
                            <p className="text-zinc-400">
                                Join thousands of donors contributing to social welfare. Together, we create lasting change in society.
                            </p>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-red-600 mb-2">1,234+</p>
                            <p className="text-zinc-400">Donations Made</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600 mb-2">₹50L+</p>
                            <p className="text-zinc-400">Total Raised</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600 mb-2">5,000+</p>
                            <p className="text-zinc-400">Lives Impacted</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600 mb-2">100%</p>
                            <p className="text-zinc-400">Transparent</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default LandingPage;
