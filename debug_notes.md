# Debug Notes - Contact Information Issue

## Issue
The "Contact Information" section in the Contrarian Individuals cards shows no email, Twitter, or LinkedIn information, even though the data is defined in the code.

## Observations
1. The Contact Information section appears empty in the UI
2. The data is correctly defined in the extractArguments function (e.g., gary.marcus@nyu.edu)
3. The contrarianIndividuals array is included in the return statement
4. The conditional rendering checks `individual.email &&` before showing the email link

## Root Cause Investigation
The issue might be that the contrarian individuals data from localStorage (saved episodes) doesn't have the email/twitter/linkedin fields, because these were added after the episodes were saved.

## Solution
Need to delete the old episodes from localStorage and create new ones, OR update the code to always include email/twitter/linkedin in the data regardless of when it was saved.
