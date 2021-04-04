import pulsar

# client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw'))
client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMSJ9.VKBK9w1g2b840WYrAvdMO6QaFldLL7Lam0BGBeGiGxI'))
consumer = client.subscribe('msgpush/11111/my-topic',
                            subscription_name='my-sub')

while True:
    msg = consumer.receive()
    print("Received message: '%s'" % msg.data())
    consumer.acknowledge(msg)

client.close()
