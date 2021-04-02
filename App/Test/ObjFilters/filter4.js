member.map(mem => {
    return memberInfo.map(info => {
        if (info.id === mem.userId) {
            mem.date = info.date;
            return mem;
            }
        })
    });