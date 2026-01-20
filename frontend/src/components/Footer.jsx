function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-800 mt-12 py-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        <span className="text-red-600">My</span>NGO
                    </h3>
                    <p className="text-zinc-400 text-sm">
                        Making a difference, one donation at a time.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li>Email: <a href="mailto:info@myngo.org" className="text-red-600 hover:text-red-500">info@myngo.org</a></li>
                        <li>Phone: <a href="tel:+91-1234567890" className="text-red-600 hover:text-red-500">+91-1234567890</a></li>
                        <li>Address: NSS College, India</li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li><a href="#" className="hover:text-red-600 transition">Facebook</a></li>
                        <li><a href="#" className="hover:text-red-600 transition">Twitter</a></li>
                        <li><a href="#" className="hover:text-red-600 transition">Instagram</a></li>
                        <li><a href="#" className="hover:text-red-600 transition">LinkedIn</a></li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-zinc-800 mt-8 pt-6 text-center text-zinc-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MyNGO. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
