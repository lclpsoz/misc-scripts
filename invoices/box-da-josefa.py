# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
#!/usr/bin/env python
# -*- coding: utf-8 -*-


# %%
raw_groceries = """2x Tomate de Primeira - 1 kg R$ 7,98 _cód. _ 
- 2x Média   
1x Batata Inglesa - 1 kg R$ 2,49 _cód. _  
1x Cenoura - 500g R$ 1,49 _cód. _  
2x Cebola branca - 1kg R$ 4,98 _cód. _  
1x Repolho Verde - Pequeno R$ 3,99 cód. Unid 
- 1x Médio   
1x Limão taiti (PROMOÇÃO) - 500g R$ 1,49 _cód. _  
1x Ovos extra vermelho - 1 duzia R$ 6,99 _cód. _  
2x Banana prata - 1 dúzia R$ 9,98 _cód. _  
1x Maçã nacional - Grauda 1kg R$ 6,99 _cód. _  
1x Maçã nacional - Graúda 500g R$ 3,49 _cód. _  
3x Mamão papaya - 2 por R$ 15,00 _cód. _  
1x Tangerina - 1kg R$ 4,99 _cód. _  
2x Tapioca - 1 kg R$ 9,98 _cód. _  
1x Banana da terra - 1 duzia R$ 15,00 _cód. _  
1x Goiaba - 1kg R$ 4,99 _cód. _  
Obs: Verdes, por favor.
1x Abacate - Medio R$ 5,00 _cód. _  
1x Uva Vitória sem caroço roxa (PROMOÇÃO) - 1kg R$ 6,99 _cód. _  
1x Alface crespa hidropônica R$ 1,99 cód. Unid  
1x Coentro R$ 0,99 cód. Unid  
1x Cebolinha - Unidade R$ 0,99 _cód. _  
1x Manjericão R$ 1,99 cód. Unid  
1x Hortelã graúdo R$ 1,49 cód. Unid  
1x Chimichurri - 100g R$ 5,00 _cód. _  
2x Macaxeira - 1kg descascada R$ 6,98 _cód. _  
1x Queijo coalho (PROMOÇÃO) - 1 kg R$ 20,99 _cód. _  
1x Banana prata - 1 dúzia R$ 4,99 _cód. _"""


# %%
nf = list(filter(lambda line: line[0].isnumeric(), raw_groceries.split('\n')))


# %%
print('For analysis')
for x in nf:
    for y in x.split(' '):
        if y[:2] == 'R$':
            print('|', y[3:], end=' ', sep='')
            break
        else:
            print(y, end=' ')
    print('')


# %%
print('For TODO list\n')
for x in nf:
    for y in x.split(' '):
        if y[:2] == 'R$':
            break
        else:
            print(y, end=' ')
    print('\n')


