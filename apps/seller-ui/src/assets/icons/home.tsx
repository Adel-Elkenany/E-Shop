import React from "react";

const Home = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 448"
            className="w-4 h-4"
            {...props}
        >
            <rect width="192" height="256" rx="0" ry="0" />
            <rect x="256" y="192" width="192" height="256" rx="0" ry="0" />
            <rect y="320" width="192" height="128" rx="0" ry="0" />
            <rect x="256" width="192" height="128" rx="0" ry="0" />
        </svg>
    );
};

export default Home;
