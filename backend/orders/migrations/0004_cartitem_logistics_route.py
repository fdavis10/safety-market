from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0003_cartitem_package"),
    ]

    operations = [
        migrations.AddField(
            model_name="cartitem",
            name="logistics_route",
            field=models.CharField(
                blank=True,
                choices=[("standard", "Стандартный маршрут"), ("multimodal", "Сложный маршрут")],
                default="standard",
                max_length=32,
                verbose_name="маршрут логистики",
            ),
        ),
    ]
