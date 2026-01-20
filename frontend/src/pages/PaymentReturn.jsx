import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api/api";
import { getToken } from "../utils/auth";

function PaymentReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Processing payment...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleReturn = async () => {
            try {
                // Get donation ID and payment status from URL
                const donationId = searchParams.get("donation_id");
                const status = searchParams.get("status") || "SUCCESS"; // PayHere might pass status

                if (!donationId) {
                    setMessage("Invalid payment return. Donation ID missing.");
                    setLoading(false);
                    return;
                }

                const token = getToken();
                if (!token) {
                    navigate("/login");
                    return;
                }

                // Update donation status
                const res = await fetch(`${API_BASE_URL}/donations/update`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        donationId: donationId,
                        status: "SUCCESS", // Mark as success when returning from PayHere
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    setMessage("✓ Payment successful! Redirecting...");
                    setTimeout(() => {
                        navigate("/donations");
                    }, 2000);
                } else {
                    setMessage("Payment completed but couldn't update status. Redirecting...");
                    setTimeout(() => {
                        navigate("/donations");
                    }, 2000);
                }
            } catch (error) {
                console.error("Payment return error:", error);
                setMessage("Error processing payment return. Redirecting...");
                setTimeout(() => {
                    navigate("/donations");
                }, 2000);
            }
        };

        handleReturn();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
            <div className="text-center">
                <div className="inline-block">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
                <p className="text-white text-lg">{message}</p>
            </div>
        </div>
    );
}

export default PaymentReturn;
