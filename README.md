# TIMECHEAT

Welcome to TIMECHEAT, a web application crafted with appreciation and love, streamlining the timesheet completion process. Developed by Jonatan Jansson in 2024, this tool is specially dedicated to the five-letter Portugal team, aiming to save time and reduce hassle in timesheet management.

### Available here:
#### [https://dotmavriq.github.io/TIMECHEAT/](https://dotmavriq.github.io/TIMECHEAT/)

## Steps

- **Copy from Previous:** Start by copying your pre-existing Excel timesheet tab from a previous month or use the example template provided if you just started.
- **Easy Steps:** Simply move the bottom marked row beyond 32 steps or so and proceed to TIMECHEAT.
- **Customization:** Pick the year, month, and your holiday area with ease.
- **Instant Print:** Press "Print" to have the timesheet copied to your clipboard. Additionally, you could choose what you need from the printout in the div under the print button.
- **Smart Highlighting:** Then you paste that into your Excel, highlights weekends and holidays, making them easy to identify and modify in your spreadsheet.
- **Efficient Editing:** Use `Ctrl + H` to search and replace (weekend!) and (holiday!) in order to remove markers for a cleaner aesthetic.
- Boom, you're done and ready to log times for that month!

## FAQ

#### **Where did you gather the sources for the holidays?**

The holiday dates are sourced from the official spreadsheet for legal holidays for 2024, provided by the head of HR.

#### **I think you may have missed a holiday?:**

The Weekend marker takes priority over the Holiday marker. 
It is likely that your holiday falls on a weekend for the current year. 
Unfortunately, this means it will not be marked separately as a holiday.
Hypothetically I could have made it state (weekend and holiday) but this is admittedly redundant and it would only add to necessary steps required to finish your spreadsheet swiftly.

#### **Can't you just do this with an Excel Formula or the date function?**

You could achieve something similar, yes! 
Excel Formulas can be very powerful.
However, whenever they require "conditional logic" they are harder to produce than programming logic in most cases and rarely do they achieve precisely what you want them to with sufficient modularity like this solution. 

Also it's like 14 steps... Google "How to add checkboxes for Microsoft Excel" and weep.

## Getting Started

To get started with TIMECHEAT, follow these simple steps:

1. Ensure you have a copy of your timesheet for the previous month or use our provided template.
2. Access TIMECHEAT and enter the necessary details: year, month, and holiday area.
3. Press "Print" to have the timesheet ready. The data will be copied to your clipboard, and you can also select specific details from the printout provided.

## Contributing

We welcome contributions and suggestions to make TIMECHEAT even better for everyone. If you have ideas or feedback, please feel free to reach out or submit a pull request.

## License

MIT License

Jonatan Jansson
