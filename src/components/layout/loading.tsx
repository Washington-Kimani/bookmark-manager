"use client";

const Loading = () => {
    return(
        <div className="flex flex-col justify-center items-center w-full h-screen">
            <span className="loading loading-ring loading-xl"></span>
            <h1 className={"text-2xl text-green-500 mt-2"}>Loading...</h1>
        </div>
    )
}

export default Loading;