import React, { useState, useRef } from "react";

const EmailForm = () => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    text: "",
    receiverEmail: "",
    files: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "files") {
      setFormData({
        ...formData,
        files: [...files],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("text", formData.text);
    formDataToSend.append("receiverEmail", formData.receiverEmail);

    formData.files.forEach((file, index) => {
      formDataToSend.append(`files`, file);
    });

    console.log("formDataToSend", formDataToSend);

    try {
      const response = await fetch(
        "https://mailflow-server1.vercel.app/send-email",
        {
          // const response = await fetch('http://localhost:5000/send-email', {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Email sent successfully!");
        setFormData({
          text: "",
          receiverEmail: "",
          files: [],
        });

        fileInputRef.current.value = "";
      } else {
        console.error("Failed to send email:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending email:", error.message);
    }
  };

  console.log(formData);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Text:
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Receiver Email:
        <input
          type="email"
          name="receiverEmail"
          value={formData.receiverEmail}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Files:
        <input
          ref={fileInputRef}
          type="file"
          name="files"
          onChange={handleChange}
          multiple
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmailForm;
