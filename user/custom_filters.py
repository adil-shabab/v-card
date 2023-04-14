from django import template

register = template.Library()

@register.filter(name='my_filter')
def my_filter(template_num):
    # do some processing on my_variable

    template_name = 'cards/template' + str(template_num)
    print(template_name)
    return template_name
