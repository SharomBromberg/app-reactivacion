import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('responde con status ok', () => {
    const controller = new HealthController();
    const result = controller.check();

    expect(result.status).toBe('ok');
    expect(typeof result.timestamp).toBe('string');
  });
});
