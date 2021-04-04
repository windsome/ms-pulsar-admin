import pulsar

# client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw'))
client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmZkMzMxYTIyMjIyMjIyMjIwMDAwMDMifQ.3kdXuhedpgdFjoFCmfnGhXlvKYfhDN_p0D6CeyCf0Es'))
consumer = client.subscribe('msgpush/5ffd331a2222222222000003/my-topic',
                            subscription_name='my-sub')

while True:
    msg = consumer.receive()
    print("Received message: '%s'" % msg.data())
    consumer.acknowledge(msg)

client.close()
