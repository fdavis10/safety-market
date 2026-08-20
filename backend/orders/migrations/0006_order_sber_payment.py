# Generated manually for Sber payment fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0005_cartitem_payment_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="sber_order_id",
            field=models.CharField(
                blank=True,
                db_index=True,
                max_length=64,
                verbose_name="ID заказа в Сбере",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="sber_order_number",
            field=models.CharField(
                blank=True,
                max_length=64,
                null=True,
                unique=True,
                verbose_name="номер заказа для Сбера",
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Ожидает оплаты"),
                    ("paid", "Оплачен"),
                    ("failed", "Ошибка оплаты"),
                ],
                default="pending",
                max_length=16,
                verbose_name="статус",
            ),
        ),
    ]
