import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { IPostgresInterval } from 'postgres-interval';

@Scalar('Interval')
export class IntervalScalar implements CustomScalar<string, IPostgresInterval> {
  description = 'Interval custom scalar type';

  parseValue(value: string): IPostgresInterval {
    return this.stringToInterval(value); // value from the client input
  }

  serialize(value: IPostgresInterval): string {
    return this.intervalToString(value); // value sent to the client
  }

  parseLiteral(ast: ValueNode): IPostgresInterval {
    if (ast.kind === Kind.STRING) {
      return this.stringToInterval(ast.value);
    }
    return null;
  }

  private intervalToString(interval: IPostgresInterval): string {
    // Convert IPostgresInterval to string representation
    const { days, hours, minutes, seconds, milliseconds } = interval;
    return `${days} days ${hours} hours ${minutes} minutes ${seconds}.${milliseconds} seconds`;
  }

  private stringToInterval(value: string): IPostgresInterval {
    // Convert string representation back to IPostgresInterval
    const regex = /(\d+) days (\d+) hours (\d+) minutes (\d+)\.(\d+) seconds/;
    const match = value.match(regex);
    if (!match) {
      throw new Error('Invalid interval format');
    }

    return {
      days: parseInt(match[1], 10),
      hours: parseInt(match[2], 10),
      minutes: parseInt(match[3], 10),
      seconds: parseInt(match[4], 10),
      milliseconds: parseInt(match[5], 10),
    } as IPostgresInterval;
  }
}
