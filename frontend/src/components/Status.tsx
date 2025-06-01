import React from 'react'

  const Status = ({status}:StatusProps) =>{
    let color;
    switch (status) {
      case "processing":
        color = "bg-yellow-500"
        break;
      case "uploading":
        color = "bg-blue-500"
        break;
      case "completed":
        color = "bg-green-500"
        break;
      default:
        color = "bg-gray-500"
        break;
    }
    return (<span className={`px-2 rounded-md ${color} text-white`} >{status}</span>)
  }

export default Status