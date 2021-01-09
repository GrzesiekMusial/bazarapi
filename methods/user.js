const userCheck = async (newId, oldId) => {
    const userValid = newId.toString() === oldId.toString() ? true : false;
    if (!userValid) return res.status(403).send("Access denied!");
};

exports.userCheck = userCheck;
