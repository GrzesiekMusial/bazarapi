const userCheck = async (newId, oldId, res = false) => {
    const userValid = newId.toString() === oldId.toString() ? true : false;
    if (!userValid && !res) {
        return res.status(403).send("Access denied!");
    }
};

exports.userCheck = userCheck;
