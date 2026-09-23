/**
 * Automated Kafka Topic Provisioner & Topology Validator
 * Phase 18: Infrastructure Management & DevOps
 */

import { Kafka } from 'kafkajs';
import { KAFKA_TOPICS } from '../server/kafka/topicStrategy.ts';

export const TOPIC_SPECIFICATIONS = [
  {
    topic: KAFKA_TOPICS.MEETING_EVENTS,
    numPartitions: 3,
    replicationFactor: 1, // Dev / Single node; use 3 in production
    configEntries: [
      { name: 'retention.ms', value: String(7 * 24 * 60 * 60 * 1000) }, // 7 days
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.CHAT_EVENTS,
    numPartitions: 6,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(30 * 24 * 60 * 60 * 1000) }, // 30 days
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.NOTIFICATION_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(7 * 24 * 60 * 60 * 1000) },
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.RECORDING_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(14 * 24 * 60 * 60 * 1000) }, // 14 days
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.USER_EVENTS,
    numPartitions: 3,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(30 * 24 * 60 * 60 * 1000) },
      { name: 'cleanup.policy', value: 'compact,delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.AUDIT_EVENTS,
    numPartitions: 6,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(365 * 24 * 60 * 60 * 1000) }, // 1 year compliance
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
  {
    topic: KAFKA_TOPICS.ANALYTICS_EVENTS,
    numPartitions: 6,
    replicationFactor: 1,
    configEntries: [
      { name: 'retention.ms', value: String(90 * 24 * 60 * 60 * 1000) },
      { name: 'cleanup.policy', value: 'delete' },
    ],
  },
];

export async function provisionKafkaTopics(brokerUrl = process.env.KAFKA_BROKERS || '127.0.0.1:9092') {
  console.log(`[Kafka Provisioner] Connecting to broker at ${brokerUrl}...`);
  const kafka = new Kafka({
    clientId: 'topic-provisioner',
    brokers: brokerUrl.split(',').map(b => b.trim()),
    retry: { retries: 2 },
  });

  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log('[Kafka Provisioner] Connected. Fetching existing topics...');
    const existingTopics = await admin.listTopics();

    const topicsToCreate = TOPIC_SPECIFICATIONS.filter(s => !existingTopics.includes(s.topic));

    if (topicsToCreate.length === 0) {
      console.log('[Kafka Provisioner] All application topics already exist. Topology verified.');
    } else {
      console.log(`[Kafka Provisioner] Creating ${topicsToCreate.length} missing topics...`);
      const success = await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true,
      });
      console.log(`[Kafka Provisioner] Topic creation result: ${success ? 'SUCCESS' : 'NO_OP'}`);
    }

    await admin.disconnect();
    return true;
  } catch (err) {
    console.warn(`[Kafka Provisioner] Notice: Broker unreachable or provisioning skipped (${err.message}).`);
    return false;
  }
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('init-kafka-topics.mjs')) {
  provisionKafkaTopics().then(() => process.exit(0)).catch(() => process.exit(1));
}
