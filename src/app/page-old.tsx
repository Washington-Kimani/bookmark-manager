"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Image from "next/image";
import {
  DoorOpen,
  BookmarkIcon,
  Zap,
  Lock,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/bookmarks");
    }
  };

  const features = [
    {
      icon: <BookmarkIcon className="w-8 h-8" />,
      title: "Easy Organization",
      description:
        "Keep all your bookmarks organized in one place with custom collections and tags.",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Quick Search",
      description:
        "Find any bookmark instantly with powerful search functionality across all your saved links.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with instant access to your bookmarks anytime.",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure & Private",
      description:
        "Your bookmarks are encrypted and stored securely. Your privacy is our priority.",
    },
  ];

  const faqs = [
    {
      question: "How do I add a new bookmark?",
      answer:
        "Simply click the 'New Bookmark' button, enter the URL, add a title and description, then save. Your bookmark will be instantly available.",
    },
    {
      question: "Can I organize bookmarks into categories?",
      answer:
        "Yes! You can create custom collections and use tags to organize your bookmarks. You can also search and filter by categories anytime.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Absolutely. We use industry-standard encryption and secure servers to protect your bookmarks. You maintain full control over your data.",
    },
    {
      question: "Can I access my bookmarks on multiple devices?",
      answer:
        "Yes, your bookmarks sync across all devices. Simply log in to your account from any device to access your complete bookmark collection.",
    },
    {
      question: "What if I forget a bookmark URL?",
      answer:
        "Our search feature helps you find bookmarks by title, description, or tags. You can also view your entire archive of bookmarks.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Sign up for free and start organizing your bookmarks immediately with full access to all features.",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 rounded-xl shadow-lg overflow-hidden">
          {/* Image */}
          <div className="w-full lg:w-1/2 h-64 md:h-96 relative">
            <Image
              src="/bg_1.jpg"
              alt="Bookmark Manager"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-start justify-center p-6 md:p-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center lg:text-left">
              Your Personal Bookmark Hub
            </h1>
            <p className="text-lg text-gray-600 mb-3 text-center lg:text-left">
              Never lose track of important links again. Organize, search, and
              access your bookmarks anywhere, anytime.
            </p>
            <p className="text-base text-gray-500 mb-8 text-center lg:text-left">
              Free, fast, and secure. Join thousands of users who trust us with
              their digital collections.
            </p>
            <button
              onClick={() => handleClick()}
              className="w-full lg:w-auto rounded-md flex items-center justify-center bg-[#26425A] hover:bg-[#3A5A7F] py-3 px-8 gap-x-3 text-white font-semibold transition-all transform hover:scale-105"
            >
              <DoorOpen className="text-white" size={20} />
              <span>Start for Free</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Everything you need to manage bookmarks efficiently
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center mb-4 text-[#C38EB4]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#26425A] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account in seconds and get started immediately.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#26425A] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add Bookmarks
              </h3>
              <p className="text-gray-600">
                Save your favorite links with titles, descriptions, and custom
                tags.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#26425A] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Access Anywhere
              </h3>
              <p className="text-gray-600">
                Access your bookmarks from any device, anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#056760] rounded-full flex items-center justify-center text-white">
                  <Check2Icon />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  100% Free
                </h3>
                <p className="text-gray-600">
                  No hidden charges, no premium plans required. Everything is
                  free forever.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#26425A] rounded-full flex items-center justify-center text-white">
                  <Check2Icon />
                </div>
                <p className="text-gray-600">
                  Enjoy a clean, distraction-free experience without any
                  advertisements.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#056760] rounded-full flex items-center justify-center text-white">
                  <Check2Icon />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  User-Friendly
                </h3>
                <p className="text-gray-600">
                  Intuitive interface designed for everyone, regardless of
                  technical skill.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#056760] rounded-full flex items-center justify-center text-white">
                  <Check2Icon />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Always Available
                </h3>
                <p className="text-gray-600">
                  Our reliable service is available 24/7 so you always have
                  access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-[#26425A] transition-transform ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600 border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#26425A] to-[#3A5A7F] rounded-xl shadow-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Organize Your Bookmarks?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join our community and start managing your links like a pro today!
          </p>
          <button
            onClick={() => handleClick()}
            className="bg-white text-[#26425A] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Bookmark Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Check2Icon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
