"use strict";
exports.__esModule = true;
var admin = require("firebase-admin");
admin.initializeApp({
    projectId: "euro2020at2021",
    credential: admin.credential.cert({
        projectId: 'euro2020at2021',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC2FGR1GTF/1Z3a\nE5R1K6d0m5d0OtKaHmJum1AO/hm0iMh2uF5uNt5KwoPU9193rTPkryulKN0Ydc56\nU7UO1zQphvDxVBJXMct5bAH260f4EJxD+MBS16Hg5MZXOFjcDCEszF/qo0hgO2/k\nk3qDXD7umCt+rKGkYAJ8a5/zs8DaK9Z4ayHan0RFjMZQAsHGWnYd8g85SecskFEq\n/qSR4Z6QqiSXbfCu1Tz2yqW6jlJbNzXaiQ3hI4MIDAj3XXo4+kKe+MtbQCUdmgTp\nECK/POe0QCMg8Gl1ByN72AsbQgXadsot4qzAuM2SK/UXotk8KYM7djskiadcsEUE\nJEgCbGfdAgMBAAECggEAB1osHZ0Ge6lONh0Y9IuZDRivSpk0IdcHldHIWiKhOmyq\nM5O0ScewvYdnOAqZHJsDf8DMXAnvYOp44PBPslQMSNT9wQY/tgJOZg5vcd9ZnkcF\nbaqLZuJK02r0JgIiIcM3n7h3nbY5g5vteRG0yRMeKMI/l140f2UFFK2/3WECcOIc\n0S4wRSYk6vZGcCCMgIvKC0JCQ3q+LkW0RIf0fgF2OFM1r6hl4Cq2pi570vEaDcUx\np0mXCaH3pZTiDDx6YgAPJLuCkBGYTcJjl5GLPvEl7QEvzywII1XMx0AGWUlMPLQj\nT8eRkSvuiAwizRdksL+L+ozKU8WBH2qEhy/xm3a4QQKBgQDj17d63w56VAirw1c4\nJqeyeq9Aulrr/PrC1kiua9Cyg7c31B1Xp1c6UmK4xDsGzrSmxuHjabXaUBZChY5E\n+BVRgpui2m3twsCLWMMddlh6Xb8o1hqSwFu6rO//r5f2p8yLVbhclFJ2Awt6nPB6\nEm6CtZ0LhfDBfh4CgFLTFaekbQKBgQDMlN3ykQy0CcdMM5N0G00A7rghjeUdVTGr\npuJMHrfvEfANy6iLj3LGOT11EClX+dTwOCG7tm+yHRBp861avc3nhY0cjGoXK+Wh\nOu7Q71bx6wy3kroLhW90DqSwhYcFnukPGKLpVY/OhCGGY2V8hnqZ6Dh8BSfKJUoA\nkYJgopJLMQKBgQDh24dQ0CkD7qWhz0R4ryjx7lgoLBPRd7gEyHLIJKx/Kb7IIwbr\nS0FW2TBvxGZW+zVtVh26V6IjxdwrGUXM7LgFUxmBOFJcrQA9okHYxOY0dxX2Hze8\nXd8QkDphFenoYrKLNPBLJeUQgzgv1b8042yVOf9x2tasmJ6bECYKhZ7niQKBgQCk\nlludS66xpXBOUOwfK9uelW9Tp2mdWK32T/Odk9UcpAzBvIgjh0uqR+C2rkLkwVzb\nyfzxnMttu046P03HRA5EZkBpqFmtvKYoOVZqhzMmu5hmk8fTfw10jFdYoIRJNFiB\nyas/F5PzbH/gM1Uxgqtd6OKQfEFPswI/RNFkV0Zk8QKBgQCgin4MJT2udENUhHxl\n1UtLBmDjvD8fcUGdoJ6cldwOIXvIkP+2sySBQqc+Gzl9tKJgXkCCK7NnY+YT1OLq\nO44lmq0idKsocepyi1UYi8x+eZg4bH2BidQ9KYRq8VdxOkvxe2Ac2DSakjYBEslk\nhJK92MVeLY4BdZQw9PwRaWCC1w==\n-----END PRIVATE KEY-----\n',
        clientEmail: 'firebase-adminsdk-2bo5w@euro2020at2021.iam.gserviceaccount.com'        
    })
  });

go();

async function go() {
    const audits = await admin.firestore().collection('audits').get();
    const users = await admin.firestore().collection('users').get();

    const auditKeys = audits.docs.map(doc => doc.data().email);
    const userKeys = users.docs.map(doc => doc.data().email);

    const usersSet = new Set(userKeys);
    const emptyAudits = auditKeys.filter(k => !usersSet.has(k));
    console.log(emptyAudits);

    var deletes = emptyAudits.map(k => admin.firestore().collection('audits').doc(k).delete());
    await Promise.all(deletes);

}