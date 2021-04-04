import pulsar

client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.KCepkApIwUV3rDgnI7hqKk6Xv3I3rRBZCwtKWkQSIGw'))
# client = pulsar.Client('pulsar://localhost:6650', authentication=pulsar.AuthenticationToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dXNlcjIifQ.VdXgq0GU96yrT-G7inW8JKF-aMNqQiqcBc4Q64BcFAM'))
producer = client.create_producer('msgpush/11111/my-topic')

for i in range(10):
    producer.send(('hello-pulsar-%d' % i).encode('utf-8'))

client.close()

