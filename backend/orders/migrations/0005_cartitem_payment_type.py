# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0004_cartitem_logistics_route"),
    ]

    operations = [
        migrations.AddField(
            model_name="cartitem",
            name="payment_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("50", "50% предоплата"),
                    ("90", "90% предоплата"),
                    ("post", "Постоплата"),
                ],
                default="50",
                max_length=16,
                verbose_name="тип оплаты",
            ),
        ),
    ]
