# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="service",
            name="prices",
            field=models.JSONField(blank=True, default=dict, verbose_name="цены по типу оплаты"),
        ),
        migrations.AddField(
            model_name="package",
            name="price_complex",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=12,
                null=True,
                verbose_name="стоимость (сложный маршрут)",
            ),
        ),
        migrations.AlterField(
            model_name="package",
            name="price",
            field=models.DecimalField(
                decimal_places=2,
                max_digits=12,
                verbose_name="стоимость (стандартный маршрут)",
            ),
        ),
    ]
