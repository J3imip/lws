import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1716737500823 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: refactor this bullshit нахуй...
    await queryRunner.query(`create or replace function no_refund_amount_lost_quantity_on_insert() returns trigger as
$$
begin
    if new.lost_quantity > 0 then raise exception 'Lost quantity is not allowed on insert'; end if;
    if new.refund_amount > 0 then raise exception 'Refund amount is not allowed on insert'; end if;
    return new;
end;
$$ language plpgsql;`);

    await queryRunner.query(`create trigger no_refund_amount_lost_quantity_on_insert
    before insert
    on "order"
    for each row
execute procedure no_refund_amount_lost_quantity_on_insert();`);

    await queryRunner.query(`create or replace function calculate_order_period() returns trigger as
$$
begin
    new.delivery_period := new.receipt_date - new.created_at;
    return new;
end;
$$ language plpgsql;`);

    await queryRunner.query(`create trigger calculate_order_period_trigger
    before insert or update
    on "order"
    for each row
execute procedure calculate_order_period();`);

    await queryRunner.query(`create or replace function calculate_refund_amount() returns trigger as
$$
begin
    if new.lost_quantity > 0 then
        -- Retrieve the product price using a subquery with proper joins
        select p.price * (new.lost_quantity + 0.05)
        into new.refund_amount
        from "order" o
                 join order_product op on op.order_id = o.id
                 join product p on p.id = op.product_id
        where o.id = new.id;
    end if;

    return new;
end;
$$ language plpgsql;`);

    await queryRunner.query(`create trigger calculate_refund_amount_trigger
    before update
    on "order"
    for each row
execute procedure calculate_refund_amount();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop trigger calculate_refund_amount_trigger on "order";`);
    await queryRunner.query(`drop function calculate_refund_amount();`);
    await queryRunner.query(`drop trigger calculate_order_period_trigger on "order";`);
    await queryRunner.query(`drop function calculate_order_period();`);
    await queryRunner.query(`drop trigger no_refund_amount_lost_quantity_on_insert on "order";`);
    await queryRunner.query(`drop function no_refund_amount_lost_quantity_on_insert();`);
  }

}
