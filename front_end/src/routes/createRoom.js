import React from "react";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
    const navigate = useNavigate();
    function create() {
        const id = uuid();
        //props.history.push(`/room/${id}`);
         navigate(`../room/${id}`, { replace: true })
        //navigate("/room", { replace: true })
    }

    return (
        <button onClick={create}>Create room</button>
    );
};

export default CreateRoom;